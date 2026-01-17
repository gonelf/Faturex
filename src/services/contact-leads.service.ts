/**
 * Contact Leads Service
 * Handles contact form submissions and email notifications
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { sendNewLeadNotification } from './email.service';

export interface CreateContactLeadInput {
  name: string;
  email: string;
  phone: string;
  business_type?: string;
  message?: string;
  source?: string;
  user_agent?: string;
  ip_address?: string;
}

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  business_type?: string;
  message?: string;
  status: string;
  source?: string;
  user_agent?: string;
  ip_address?: string;
  notes?: string;
  contacted_at?: string;
  assigned_to?: string;
  notification_sent: boolean;
  notification_sent_at?: string;
  created_at: string;
  updated_at: string;
}

export class ContactLeadsService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase configuration missing');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Create a new contact lead and send email notification
   */
  async createContactLead(input: CreateContactLeadInput): Promise<ContactLead> {
    try {
      // Insert the contact lead into the database
      const { data: lead, error } = await this.supabase
        .from('contact_leads')
        .insert([
          {
            name: input.name,
            email: input.email,
            phone: input.phone,
            business_type: input.business_type,
            message: input.message,
            source: input.source || 'homepage_form',
            user_agent: input.user_agent,
            ip_address: input.ip_address,
            status: 'new',
            notification_sent: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Database error creating contact lead:', error);
        throw new Error(`Failed to create contact lead: ${error.message}`);
      }

      if (!lead) {
        throw new Error('Failed to create contact lead: No data returned');
      }

      // Send email notification asynchronously
      this.sendNotificationAsync(lead);

      return lead;
    } catch (error: any) {
      console.error('Error in createContactLead:', error);
      throw error;
    }
  }

  /**
   * Send email notification asynchronously and update notification status
   */
  private async sendNotificationAsync(lead: ContactLead): Promise<void> {
    try {
      await sendNewLeadNotification(lead);

      // Update notification status
      await this.supabase
        .from('contact_leads')
        .update({
          notification_sent: true,
          notification_sent_at: new Date().toISOString(),
        })
        .eq('id', lead.id);

      console.log(`Email notification sent for lead ${lead.id}`);
    } catch (error) {
      console.error(`Failed to send notification for lead ${lead.id}:`, error);
      // Don't throw error - we don't want to fail the lead creation if email fails
    }
  }

  /**
   * Get all contact leads with optional filtering
   */
  async getContactLeads(options?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ContactLead[]> {
    try {
      let query = this.supabase
        .from('contact_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (options?.status) {
        query = query.eq('status', options.status);
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      if (options?.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Database error fetching contact leads:', error);
        throw new Error(`Failed to fetch contact leads: ${error.message}`);
      }

      return data || [];
    } catch (error: any) {
      console.error('Error in getContactLeads:', error);
      throw error;
    }
  }

  /**
   * Get a single contact lead by ID
   */
  async getContactLeadById(id: string): Promise<ContactLead | null> {
    try {
      const { data, error } = await this.supabase
        .from('contact_leads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Not found
          return null;
        }
        console.error('Database error fetching contact lead:', error);
        throw new Error(`Failed to fetch contact lead: ${error.message}`);
      }

      return data;
    } catch (error: any) {
      console.error('Error in getContactLeadById:', error);
      throw error;
    }
  }

  /**
   * Update contact lead status
   */
  async updateContactLeadStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<ContactLead> {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'contacted' && notes) {
        updateData.contacted_at = new Date().toISOString();
        updateData.notes = notes;
      }

      const { data, error } = await this.supabase
        .from('contact_leads')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Database error updating contact lead:', error);
        throw new Error(`Failed to update contact lead: ${error.message}`);
      }

      if (!data) {
        throw new Error('Contact lead not found');
      }

      return data;
    } catch (error: any) {
      console.error('Error in updateContactLeadStatus:', error);
      throw error;
    }
  }
}
