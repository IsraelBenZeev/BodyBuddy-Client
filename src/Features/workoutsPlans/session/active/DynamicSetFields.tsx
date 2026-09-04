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
}

const DynamicSetFields = ({ control, basePath, fields }: DynamicSetFieldsProps) => {
  const requiredFields = fields.filter((field) => !field.optional);
  const optionalFields = fields.filter((field) => field.optional);
  const requiredFieldKeys = new Set(requiredFields.map((field) => field.key));
  const shouldStackCardioFields = ['duration', 'speed', 'incline'].every((key) =>
    requiredFieldKeys.has(key)
  );

  return (
    <View className="w-full gap-4">
      {requiredFields.length > 0 && (
        <View
          className={shouldStackCardioFields ? 'w-full gap-5' : 'w-full flex-row flex-wrap gap-2'}
        >
          {requiredFields.map((field) => (
            <View className={shouldStackCardioFields ? 'w-full' : 'flex-1'} key={field.key}>
              {field.type === 'duration' ? (
                <DurationInput control={control} name={`${basePath}.${field.key}`} label={field.label} />
              ) : (
                <StepInput
                  control={control}
                  name={`${basePath}.${field.key}`}
                  label={field.label}
                  step={1}
                  disabled={false}
                />
              )}
            </View>
          ))}
        </View>
      )}

      {optionalFields.map((field) => (
        <OptionalFieldToggle key={field.key} label={`הוסף ${field.label}`}>
          {field.type === 'duration' ? (
            <DurationInput
              control={control}
              name={`${basePath}.${field.key}`}
              label={field.label}
              shouldUnregister
            />
          ) : (
            <StepInput
              control={control}
              name={`${basePath}.${field.key}`}
              label={field.label}
              step={1}
              disabled={false}
              shouldUnregister
            />
          )}
        </OptionalFieldToggle>
      ))}
    </View>
  );
};

export default DynamicSetFields;
