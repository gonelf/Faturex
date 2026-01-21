/**
 * AT SOAP Service
 *
 * Low-level SOAP client for communicating with AT (Autoridade Tributária) webservices
 * Handles SOAP connection, authentication, and invoice submission
 *
 * References:
 * - Production endpoint: https://servicos.portaldasfinancas.gov.pt:723/fatcorews/ws/
 * - Old endpoint (deprecated): https://servicos.portaldasfinancas.gov.pt:700/fews/faturas
 * - Contact for test certificates: asi-psws@at.gov.pt
 */

import * as soap from 'soap';
import * as fs from 'fs';
import * as path from 'path';

/**
 * AT SOAP configuration
 */
export interface ATSOAPConfig {
  wsdlUrl: string;
  username: string; // Format: "NIF/0001"
  password: string;
  certificate?: Buffer; // Optional digital certificate
  timeout?: number; // Request timeout in ms (default: 30000)
}

/**
 * AT invoice submission result
 */
export interface ATInvoiceSubmissionResult {
  success: boolean;
  atResponseCode: string;
  atMessage: string;
  atDocumentId?: string;
  errorDetails?: any;
}

/**
 * AT credentials validation result
 */
export interface ATValidationResult {
  success: boolean;
  permissions?: {
    wse: boolean; // Webservice de Gestão de Séries
    wfa: boolean; // Webservice de Comunicação de dados de faturas
    wdt: boolean; // Webservice de Comunicação de Documentos de Transporte
  };
  companyNif?: string;
  companyName?: string;
  message?: string;
  errorDetails?: any;
}

/**
 * AT SOAP Client
 *
 * Handles low-level SOAP communication with AT webservice
 */
export class ATSOAPService {
  private client: soap.Client | null = null;
  private config: ATSOAPConfig | null = null;

  /**
   * Connect to AT SOAP webservice
   *
   * @param config - SOAP configuration with credentials
   * @throws Error if connection fails
   */
  async connect(config: ATSOAPConfig): Promise<void> {
    try {
      this.config = config;

      // SOAP client options
      const options: soap.IOptions = {
        disableCache: true,
        endpoint: config.wsdlUrl,
      };

      // Set timeout if provided
      if (config.timeout) {
        options.wsdl_options = {
          timeout: config.timeout,
        };
      }

      // Create SOAP client
      // Note: If WSDL is not publicly accessible, you may need to load it from a local file
      this.client = await soap.createClientAsync(config.wsdlUrl, options);

      // Configure authentication
      if (config.certificate) {
        // Certificate-based authentication (for production)
        // This requires proper SSL/TLS certificate setup
        this.setupCertificateAuth(config.certificate);
      } else {
        // Basic username/password authentication
        // This is commonly used with sub-users (subutilizadores)
        this.setupBasicAuth(config.username, config.password);
      }

      console.log('✓ Connected to AT SOAP webservice');
    } catch (error) {
      throw new Error(
        `Failed to connect to AT SOAP webservice: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Setup basic authentication (username/password)
   * Used with sub-users created in Portal das Finanças
   */
  private setupBasicAuth(username: string, password: string): void {
    if (!this.client) {
      throw new Error('SOAP client not initialized');
    }

    // Set basic auth header
    this.client.setWSSecurity(new soap.BasicAuthSecurity(username, password));
  }

  /**
   * Setup certificate-based authentication
   * Used for production environments with digital certificates
   */
  private setupCertificateAuth(certificate: Buffer): void {
    if (!this.client) {
      throw new Error('SOAP client not initialized');
    }

    // Set SSL/TLS certificate security
    this.client.setSecurity(
      new soap.ClientSSLSecurity(
        certificate, // private key
        certificate, // public cert
        {
          rejectUnauthorized: true,
        }
      )
    );
  }

  /**
   * Test connection and validate credentials
   *
   * This method should call a lightweight AT endpoint to verify credentials
   * The exact method name depends on the AT WSDL specification
   *
   * @returns Validation result with permissions
   */
  async validateCredentials(): Promise<ATValidationResult> {
    if (!this.client || !this.config) {
      throw new Error('SOAP client not connected. Call connect() first.');
    }

    try {
      // ========================================================================
      // TODO: Replace with actual AT WSDL method name
      // ========================================================================
      // The method name below is a placeholder and should be replaced with
      // the actual method from AT's WSDL documentation
      //
      // Common method names might be:
      // - ValidarCredenciais
      // - TestConnection
      // - VerifyPermissions
      //
      // Consult the official AT WSDL for the correct method name
      // ========================================================================

      // Example call (adjust based on actual WSDL):
      // const result = await this.client.ValidarCredenciaisAsync({
      //   username: this.config.username,
      // });

      // For now, return a mock result until we have the actual WSDL
      // This allows the system to function while waiting for official documentation
      return {
        success: true,
        permissions: {
          wse: true,
          wfa: true,
          wdt: false,
        },
        companyNif: this.config.username.split('/')[0],
        companyName: 'Mock Company (Replace with real SOAP call)',
        message: 'Mock validation - Replace with actual AT SOAP method',
      };
    } catch (error) {
      return {
        success: false,
        message: `Credentials validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        errorDetails: error,
      };
    }
  }

  /**
   * Submit invoice to AT
   *
   * @param invoiceXML - XML string containing invoice data in AT format
   * @returns Submission result
   */
  async submitInvoice(invoiceXML: string): Promise<ATInvoiceSubmissionResult> {
    if (!this.client) {
      throw new Error('SOAP client not connected. Call connect() first.');
    }

    try {
      // ========================================================================
      // TODO: Replace with actual AT WSDL method name
      // ========================================================================
      // The method name below is a placeholder and should be replaced with
      // the actual method from AT's WSDL documentation
      //
      // Common method names for invoice submission might be:
      // - SubmeterFatura
      // - EnviarDocumento
      // - RegistarFatura
      // - ComunicarFatura
      //
      // The XML parameter name also depends on the WSDL specification
      // ========================================================================

      // Example call (adjust based on actual WSDL):
      // const result = await this.client.SubmeterFaturaAsync({
      //   dadosFatura: invoiceXML,
      // });
      //
      // Parse response:
      // const responseData = result[0]; // SOAP response structure
      // return {
      //   success: responseData.sucesso === true,
      //   atResponseCode: responseData.codigo,
      //   atMessage: responseData.mensagem,
      //   atDocumentId: responseData.idDocumento,
      // };

      // Mock response for now
      return {
        success: true,
        atResponseCode: '0',
        atMessage: 'Mock submission - Replace with actual AT SOAP method',
        atDocumentId: `MOCK-${Date.now()}`,
      };
    } catch (error) {
      return {
        success: false,
        atResponseCode: 'SOAP_ERROR',
        atMessage: error instanceof Error ? error.message : 'Unknown error',
        errorDetails: error,
      };
    }
  }

  /**
   * Get available SOAP methods from WSDL
   * Useful for debugging and discovering AT's API
   *
   * @returns List of available methods
   */
  getAvailableMethods(): string[] {
    if (!this.client) {
      throw new Error('SOAP client not connected');
    }

    const description = this.client.describe();
    const methods: string[] = [];

    // Extract method names from WSDL description
    for (const service in description) {
      for (const port in description[service]) {
        for (const method in description[service][port]) {
          methods.push(method);
        }
      }
    }

    return methods;
  }

  /**
   * Disconnect from SOAP service
   */
  disconnect(): void {
    this.client = null;
    this.config = null;
  }
}

/**
 * Utility: Load certificate from file
 *
 * @param certificatePath - Path to .pfx or .pem certificate file
 * @param password - Certificate password (for .pfx files)
 * @returns Certificate buffer
 */
export function loadCertificate(certificatePath: string, password?: string): Buffer {
  if (!fs.existsSync(certificatePath)) {
    throw new Error(`Certificate file not found: ${certificatePath}`);
  }

  const certificate = fs.readFileSync(certificatePath);

  // If it's a PFX file, you may need to convert it to PEM format
  // This can be done using the 'node-forge' or 'pem' npm packages

  return certificate;
}

/**
 * Get AT WSDL URL based on environment
 *
 * @param environment - 'development' or 'production'
 * @returns WSDL URL
 */
export function getATWSDLUrl(environment: 'development' | 'production' = 'development'): string {
  // These URLs should be verified with official AT documentation
  // and updated in environment variables

  if (environment === 'production') {
    // Production endpoint (Port 723)
    return (
      process.env.AT_WSDL_URL_PRODUCTION ||
      'https://servicos.portaldasfinancas.gov.pt:723/fatcorews/ws?wsdl'
    );
  } else {
    // Development/Testing endpoint (Port 722 or test environment)
    // Note: AT may provide a separate test environment endpoint
    // Contact asi-psws@at.gov.pt for test certificate and endpoint
    return (
      process.env.AT_WSDL_URL_HOMOLOG ||
      'https://servicos.portaldasfinancas.gov.pt:722/fatcorews/ws?wsdl'
    );
  }
}

export default {
  ATSOAPService,
  loadCertificate,
  getATWSDLUrl,
};
