import React, { useState } from 'react';
import { useForm } from '../contexts/FormContext';
import { Plus, Trash2, Zap } from 'lucide-react';
import { ConditionalRule } from '../types/FormTypes';

interface ConditionalRulesPanelProps {
  selectedFieldId: string | null;
}

export const ConditionalRulesPanel: React.FC<ConditionalRulesPanelProps> = ({ selectedFieldId }) => {
  const { currentForm, addConditionalRule, removeConditionalRule } = useForm();
  const [showAddRule, setShowAddRule] = useState(false);
  const [newRule, setNewRule] = useState<Partial<ConditionalRule>>({
    condition: {
      field: '',
      operator: 'equals',
      value: ''
    },
    action: {
      type: 'show',
      target: selectedFieldId || ''
    }
  });

  const selectedField = currentForm.fields.find(f => f.id === selectedFieldId);

  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'contains', label: 'Contains' },
    { value: 'notContains', label: 'Not Contains' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
    { value: 'greaterThanOrEqual', label: 'Greater Than or Equal' },
    { value: 'lessThanOrEqual', label: 'Less Than or Equal' },
    { value: 'isEmpty', label: 'Is Empty' },
    { value: 'isNotEmpty', label: 'Is Not Empty' }
  ];

  const actionTypes = [
    { value: 'show', label: 'Show Field' },
    { value: 'hide', label: 'Hide Field' },
    { value: 'enable', label: 'Enable Field' },
    { value: 'disable', label: 'Disable Field' },
    { value: 'setValue', label: 'Set Value' },
    { value: 'showWarning', label: 'Show Warning' },
    { value: 'hideWarning', label: 'Hide Warning' }
  ];

  const handleAddRule = () => {
    if (!selectedFieldId || !newRule.condition?.field || !newRule.action?.type) return;

    const rule: ConditionalRule = {
      id: `rule-${Date.now()}`,
      condition: {
        field: newRule.condition.field,
        operator: newRule.condition.operator || 'equals',
        value: newRule.condition.value
      },
      action: {
        type: newRule.action.type,
        target: newRule.action.target || selectedFieldId,
        value: newRule.action.value,
        message: newRule.action.message
      }
    };

    addConditionalRule(selectedFieldId, rule);
    setNewRule({
      condition: { field: '', operator: 'equals', value: '' },
      action: { type: 'show', target: selectedFieldId }
    });
    setShowAddRule(false);
  };

  if (!selectedField) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Conditional Rules</h3>
        </div>
        
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Zap className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-sm text-gray-500">Select a field to add conditional rules</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-900">Conditional Rules</h3>
        </div>
        <button
          onClick={() => setShowAddRule(true)}
          className="p-1 text-purple-600 hover:bg-purple-50 rounded"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Selected Field:</strong> {selectedField.label}
        </p>
      </div>

      {/* Existing Rules */}
      <div className="space-y-3 mb-4">
        {selectedField.conditionalRules.map(rule => (
          <div key={rule.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-700 mb-1">Condition</div>
                <div className="text-xs text-gray-600">
                  When <strong>{currentForm.fields.find(f => f.id === rule.condition.field)?.label || rule.condition.field}</strong>{' '}
                  <strong>{rule.condition.operator}</strong>{' '}
                  {rule.condition.operator !== 'isEmpty' && rule.condition.operator !== 'isNotEmpty' && (
                    <strong>"{rule.condition.value}"</strong>
                  )}
                </div>
              </div>
              <button
                onClick={() => removeConditionalRule(selectedFieldId, rule.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            
            <div>
              <div className="text-xs font-medium text-gray-700 mb-1">Action</div>
              <div className="text-xs text-gray-600">
                <strong>{rule.action.type}</strong>{' '}
                {rule.action.target && (
                  <>target: <strong>{currentForm.fields.find(f => f.id === rule.action.target)?.label || rule.action.target}</strong></>
                )}
                {rule.action.value && (
                  <> with value: <strong>"{rule.action.value}"</strong></>
                )}
                {rule.action.message && (
                  <> message: <strong>"{rule.action.message}"</strong></>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Rule Form */}
      {showAddRule && (
        <div className="p-4 border border-purple-200 rounded-lg bg-purple-50">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Rule</h4>
          
          <div className="space-y-3">
            {/* Condition */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">When Field</label>
              <select
                value={newRule.condition?.field || ''}
                onChange={(e) => setNewRule(prev => ({
                  ...prev,
                  condition: { ...prev.condition!, field: e.target.value }
                }))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              >
                <option value="">Select field...</option>
                {currentForm.fields.filter(f => f.id !== selectedFieldId).map(field => (
                  <option key={field.id} value={field.id}>{field.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Operator</label>
              <select
                value={newRule.condition?.operator || 'equals'}
                onChange={(e) => setNewRule(prev => ({
                  ...prev,
                  condition: { ...prev.condition!, operator: e.target.value as any }
                }))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              >
                {operators.map(op => (
                  <option key={op.value} value={op.value}>{op.label}</option>
                ))}
              </select>
            </div>
            
            {newRule.condition?.operator !== 'isEmpty' && newRule.condition?.operator !== 'isNotEmpty' && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  value={newRule.condition?.value || ''}
                  onChange={(e) => setNewRule(prev => ({
                    ...prev,
                    condition: { ...prev.condition!, value: e.target.value }
                  }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  placeholder="Enter value..."
                />
              </div>
            )}
            
            {/* Action */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Then</label>
              <select
                value={newRule.action?.type || 'show'}
                onChange={(e) => setNewRule(prev => ({
                  ...prev,
                  action: { ...prev.action!, type: e.target.value as any }
                }))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              >
                {actionTypes.map(action => (
                  <option key={action.value} value={action.value}>{action.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Target Field</label>
              <select
                value={newRule.action?.target || selectedFieldId}
                onChange={(e) => setNewRule(prev => ({
                  ...prev,
                  action: { ...prev.action!, target: e.target.value }
                }))}
                className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
              >
                {currentForm.fields.map(field => (
                  <option key={field.id} value={field.id}>{field.label}</option>
                ))}
              </select>
            </div>
            
            {(newRule.action?.type === 'setValue') && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Set Value To</label>
                <input
                  type="text"
                  value={newRule.action?.value || ''}
                  onChange={(e) => setNewRule(prev => ({
                    ...prev,
                    action: { ...prev.action!, value: e.target.value }
                  }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  placeholder="Enter value..."
                />
              </div>
            )}
            
            {(newRule.action?.type === 'showWarning') && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Warning Message</label>
                <input
                  type="text"
                  value={newRule.action?.message || ''}
                  onChange={(e) => setNewRule(prev => ({
                    ...prev,
                    action: { ...prev.action!, message: e.target.value }
                  }))}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                  placeholder="Enter warning message..."
                />
              </div>
            )}
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddRule}
              className="flex-1 px-3 py-2 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
            >
              Add Rule
            </button>
            <button
              onClick={() => setShowAddRule(false)}
              className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Example Rules */}
      <div className="mt-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-xs font-medium text-gray-900 mb-2">Example Rules</h4>
        <div className="space-y-2 text-xs text-gray-600">
          <div>• If "Name" contains "Test" → Show "Debug Info" field</div>
          <div>• If "Age" greater than 18 → Enable "Adult Options" field</div>
          <div>• If "Email" is empty → Show warning "Email required"</div>
          <div>• If "Country" equals "US" → Show "State" dropdown</div>
        </div>
      </div>
    </div>
  );
};