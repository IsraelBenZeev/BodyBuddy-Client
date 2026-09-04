import { InputFieldDefinition } from '@/src/types/exercise';
import OptionalFieldToggle from '@/src/ui/OptionalFieldToggle';
import { Control } from 'react-hook-form';
import { View } from 'react-native';
import StepInput from './StepInput';
import DurationInput from './DurationInput';

interface DynamicSetFieldsProps {
  control: Control<any>;
  basePath: string; // `exercises.${exerciseId}.sets.${index}`
  fields: InputFieldDefinition[];
  optionalFieldVisibility: Record<string, boolean>;
  onOptionalFieldVisibilityChange: (fieldId: string, enabled: boolean) => void;
}

const DynamicSetFields = ({
  control,
  basePath,
  fields,
  optionalFieldVisibility,
  onOptionalFieldVisibilityChange,
}: DynamicSetFieldsProps) => {
  const requiredFields = fields.filter((field) => !field.optional);
  const optionalFields = fields.filter((field) => field.optional);
  const enabledOptionalFields = optionalFields.filter(
    (field) => optionalFieldVisibility[`${basePath}.${field.key}`] ?? false
  );
  const visibleFields = [...requiredFields, ...enabledOptionalFields];
  const requiredFieldKeys = new Set(requiredFields.map((field) => field.key));
  const shouldStackCardioFields = ['duration', 'speed', 'incline'].every((key) =>
    requiredFieldKeys.has(key)
  );

  const renderField = (field: InputFieldDefinition) =>
    field.type === 'duration' ? (
      <DurationInput control={control} name={`${basePath}.${field.key}`} label={field.label} />
    ) : (
      <StepInput
        control={control}
        name={`${basePath}.${field.key}`}
        label={field.label}
        step={1}
        disabled={false}
      />
    );

  return (
    <View className="w-full gap-4">
      {optionalFields.map((field) => (
        <OptionalFieldToggle
          key={field.key}
          label={`הוסף ${field.label}`}
          enabled={optionalFieldVisibility[`${basePath}.${field.key}`] ?? false}
          onToggle={(enabled) => {
            const fieldPath = `${basePath}.${field.key}`;
            onOptionalFieldVisibilityChange(fieldPath, enabled);
            if (!enabled) control.unregister(fieldPath);
          }}
        />
      ))}

      {visibleFields.length > 0 && (
        <View
          className={shouldStackCardioFields ? 'w-full gap-5' : 'w-full flex-row flex-wrap gap-2'}
        >
          {visibleFields.map((field) => (
            <View className={shouldStackCardioFields ? 'w-full' : 'flex-1'} key={field.key}>
              {renderField(field)}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default DynamicSetFields;
