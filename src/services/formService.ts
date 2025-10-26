import { supabase } from '../lib/supabase';
import { FormConfig } from '../types/FormTypes';

export interface SavedForm {
  id: string;
  name: string;
  description: string;
  fields: any;
  global_rules: any;
  submit_action: any;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  is_published: boolean;
  slug: string;
}

export interface FormSubmission {
  id: string;
  form_id: string;
  submission_data: any;
  submitted_at: string;
  ip_address: string | null;
  user_agent: string | null;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Math.random().toString(36).substring(2, 8);
}

export const formService = {
  async createForm(formConfig: FormConfig): Promise<SavedForm | null> {
    try {
      const slug = generateSlug(formConfig.name);

      const { data, error } = await supabase
        .from('forms')
        .insert({
          name: formConfig.name,
          description: '',
          fields: formConfig.fields,
          global_rules: formConfig.globalRules,
          submit_action: formConfig.submitAction,
          slug,
          is_published: false,
          user_id: null
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating form:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error creating form:', error);
      return null;
    }
  },

  async updateForm(formId: string, formConfig: Partial<FormConfig>): Promise<SavedForm | null> {
    try {
      const updateData: any = {};

      if (formConfig.name) updateData.name = formConfig.name;
      if (formConfig.fields) updateData.fields = formConfig.fields;
      if (formConfig.globalRules) updateData.global_rules = formConfig.globalRules;
      if (formConfig.submitAction) updateData.submit_action = formConfig.submitAction;

      const { data, error } = await supabase
        .from('forms')
        .update(updateData)
        .eq('id', formId)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error updating form:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error updating form:', error);
      return null;
    }
  },

  async getForm(formId: string): Promise<SavedForm | null> {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', formId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching form:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching form:', error);
      return null;
    }
  },

  async getFormBySlug(slug: string): Promise<SavedForm | null> {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching form by slug:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching form by slug:', error);
      return null;
    }
  },

  async getAllForms(): Promise<SavedForm[]> {
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching forms:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching forms:', error);
      return [];
    }
  },

  async deleteForm(formId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId);

      if (error) {
        console.error('Error deleting form:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting form:', error);
      return false;
    }
  },

  async publishForm(formId: string, isPublished: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('forms')
        .update({ is_published: isPublished })
        .eq('id', formId);

      if (error) {
        console.error('Error publishing form:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error publishing form:', error);
      return false;
    }
  },

  async submitForm(formId: string, submissionData: any): Promise<FormSubmission | null> {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .insert({
          form_id: formId,
          submission_data: submissionData,
          ip_address: null,
          user_agent: navigator.userAgent
        })
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error submitting form:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error submitting form:', error);
      return null;
    }
  },

  async getFormSubmissions(formId: string): Promise<FormSubmission[]> {
    try {
      const { data, error } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('form_id', formId)
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
  },

  convertToFormConfig(savedForm: SavedForm): FormConfig {
    return {
      id: savedForm.id,
      name: savedForm.name,
      fields: savedForm.fields,
      globalRules: savedForm.global_rules,
      submitAction: savedForm.submit_action
    };
  }
};
