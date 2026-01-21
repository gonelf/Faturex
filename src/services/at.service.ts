/**
 * AT (Autoridade Tributária) Service
 *
 * Handles integration with Portuguese Tax Authority webservices:
 * - Credentials validation
 * - Invoice submission (Phase 2)
 * - Series validation (Phase 2)
 * - Document status checks (Phase 2)
 *
 * Current Phase: Credentials validation and management
 * Future Phase: SOAP webservice integration
 */

import { createClient } from '@supabase/supabase-js';
import { encrypt, decrypt } from './encryption.service';
import { validateNIF } from '../utils/nif-validator';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Credentials validation response
 */
export interface CredentialsValidationResult {
  valid: boolean;
  permissions?: {
    wse: boolean; // Gestão de séries por webservice
    wfa: boolean; // Comunicação de dados de faturas
    wdt: boolean; // Documentos de transporte
  };
  companyNif?: string;
  companyName?: string;
  error?: string;
}

/**
 * AT credentials input
 */
export interface ATCredentials {
  username: string; // Format: "NIF/0001"
  password: string;
}

/**
 * Saved AT credentials (with encryption)
 */
export interface SavedATCredentials {
  id: string;
  tenantId: string;
  atUsername: string;
  wseEnabled: boolean;
  wfaEnabled: boolean;
  wdtEnabled: boolean;
  isActive: boolean;
  lastValidatedAt?: string;
  validationError?: string;
}

/**
 * Validate AT username format
 * Expected format: "NIF/NUMBER" (e.g., "123456789/0001")
 */
function validateUsernameFormat(username: string): { valid: boolean; nif?: string; error?: string } {
  const usernameRegex = /^(\d{9})\/\d+$/;
  const match = username.match(usernameRegex);

  if (!match) {
    return {
      valid: false,
      error: 'Formato de utilizador inválido. Esperado: NIF/NÚMERO (ex: 123456789/0001)',
    };
  }

  const nif = match[1];

  // Validate NIF using existing validator
  if (!validateNIF(nif)) {
    return {
      valid: false,
      error: 'NIF inválido no utilizador',
    };
  }

  return {
    valid: true,
    nif,
  };
}

/**
 * Validate AT credentials with Portal das Finanças
 *
 * NOTE: This is a Phase 1 implementation with mock validation
 * Phase 2 will implement actual SOAP webservice integration
 *
 * @param credentials - AT username and password
 * @returns Validation result with permissions
 */
export async function validateCredentials(
  credentials: ATCredentials
): Promise<CredentialsValidationResult> {
  try {
    // Validate username format
    const usernameValidation = validateUsernameFormat(credentials.username);
    if (!usernameValidation.valid) {
      return {
        valid: false,
        error: usernameValidation.error,
      };
    }

    const companyNif = usernameValidation.nif!;

    // Validate password format (8-14 characters as per AT requirements)
    if (!credentials.password || credentials.password.length < 8 || credentials.password.length > 14) {
      return {
        valid: false,
        error: 'Password deve ter entre 8 e 14 caracteres',
      };
    }

    // ========================================================================
    // PHASE 1: MOCK VALIDATION
    // ========================================================================
    // In Phase 2, this will be replaced with actual SOAP webservice call to AT
    // For now, we accept credentials if format is valid and simulate response
    // ========================================================================

    // TODO Phase 2: Implement actual SOAP call to AT webservice
    // const soapResponse = await callATWebservice(credentials);

    // Mock validation - accept if format is valid
    // In production, this would call AT's webservice endpoint
    const mockValidation = await mockATValidation(credentials, companyNif);

    return mockValidation;
  } catch (error) {
    return {
      valid: false,
      error: `Erro ao validar credenciais: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
    };
  }
}

/**
 * Mock AT validation (Phase 1)
 * Simulates AT webservice response for development/testing
 *
 * This will be replaced with actual SOAP integration in Phase 2
 */
async function mockATValidation(
  credentials: ATCredentials,
  companyNif: string
): Promise<CredentialsValidationResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // For development: accept any valid format credentials
  // In Phase 2, this will be replaced with actual AT webservice call

  // Mock company lookup based on NIF
  const mockCompanyName = `Empresa ${companyNif}`;

  // Mock permissions - in reality these come from AT
  // For now, assume all permissions are granted
  return {
    valid: true,
    permissions: {
      wse: true, // Gestão de séries
      wfa: true, // Comunicação de faturas
      wdt: false, // Documentos de transporte
    },
    companyNif,
    companyName: mockCompanyName,
  };
}

/**
 * Save AT credentials for a tenant
 *
 * @param tenantId - Tenant UUID
 * @param credentials - AT username and password
 * @returns Saved credentials info (without password)
 */
export async function saveCredentials(
  tenantId: string,
  credentials: ATCredentials
): Promise<SavedATCredentials> {
  try {
    // Validate credentials first
    const validation = await validateCredentials(credentials);

    if (!validation.valid) {
      throw new Error(validation.error || 'Credenciais inválidas');
    }

    // Encrypt password
    const encryptedPassword = encrypt(credentials.password);

    // Save to database
    const { data, error } = await supabase
      .from('tenant_at_credentials')
      .upsert(
        {
          tenant_id: tenantId,
          at_username: credentials.username,
          at_password_encrypted: encryptedPassword,
          wse_enabled: validation.permissions?.wse || false,
          wfa_enabled: validation.permissions?.wfa || false,
          wdt_enabled: validation.permissions?.wdt || false,
          is_active: true,
          last_validated_at: new Date().toISOString(),
          validation_error: null,
        },
        {
          onConflict: 'tenant_id',
        }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao guardar credenciais: ${error.message}`);
    }

    return {
      id: data.id,
      tenantId: data.tenant_id,
      atUsername: data.at_username,
      wseEnabled: data.wse_enabled,
      wfaEnabled: data.wfa_enabled,
      wdtEnabled: data.wdt_enabled,
      isActive: data.is_active,
      lastValidatedAt: data.last_validated_at,
    };
  } catch (error) {
    throw new Error(
      `Erro ao guardar credenciais AT: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    );
  }
}

/**
 * Get AT credentials for a tenant
 *
 * @param tenantId - Tenant UUID
 * @returns Credentials info (without decrypted password)
 */
export async function getCredentials(tenantId: string): Promise<SavedATCredentials | null> {
  try {
    const { data, error } = await supabase
      .from('tenant_at_credentials')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      tenantId: data.tenant_id,
      atUsername: data.at_username,
      wseEnabled: data.wse_enabled,
      wfaEnabled: data.wfa_enabled,
      wdtEnabled: data.wdt_enabled,
      isActive: data.is_active,
      lastValidatedAt: data.last_validated_at,
      validationError: data.validation_error,
    };
  } catch (error) {
    throw new Error(
      `Erro ao obter credenciais AT: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    );
  }
}

/**
 * Get decrypted AT credentials for a tenant
 * Use with caution - only for actual AT webservice calls
 *
 * @param tenantId - Tenant UUID
 * @returns Decrypted credentials or null
 */
export async function getDecryptedCredentials(tenantId: string): Promise<ATCredentials | null> {
  try {
    const { data, error } = await supabase
      .from('tenant_at_credentials')
      .select('at_username, at_password_encrypted')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    // Decrypt password
    const decryptedPassword = decrypt(data.at_password_encrypted);

    return {
      username: data.at_username,
      password: decryptedPassword,
    };
  } catch (error) {
    throw new Error(
      `Erro ao obter credenciais AT: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    );
  }
}

/**
 * Delete AT credentials for a tenant
 *
 * @param tenantId - Tenant UUID
 */
export async function deleteCredentials(tenantId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('tenant_at_credentials')
      .update({ is_active: false })
      .eq('tenant_id', tenantId);

    if (error) {
      throw new Error(`Erro ao remover credenciais: ${error.message}`);
    }
  } catch (error) {
    throw new Error(
      `Erro ao remover credenciais AT: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    );
  }
}

/**
 * Log AT submission attempt
 *
 * @param tenantId - Tenant UUID
 * @param submissionType - Type of submission
 * @param status - Status of submission
 * @param requestPayload - Request data
 * @param responsePayload - Response data
 * @param errorMessage - Error message if failed
 */
export async function logSubmission(
  tenantId: string,
  submissionType: string,
  status: 'pending' | 'success' | 'error' | 'retry',
  requestPayload?: any,
  responsePayload?: any,
  errorMessage?: string
): Promise<void> {
  try {
    await supabase.from('at_submission_logs').insert({
      tenant_id: tenantId,
      submission_type: submissionType,
      status,
      request_payload: requestPayload,
      response_payload: responsePayload,
      error_message: errorMessage,
      submitted_at: new Date().toISOString(),
    });
  } catch (error) {
    // Log error but don't throw - logging failures shouldn't break main flow
    console.error('Failed to log AT submission:', error);
  }
}

export default {
  validateCredentials,
  saveCredentials,
  getCredentials,
  getDecryptedCredentials,
  deleteCredentials,
  logSubmission,
};
