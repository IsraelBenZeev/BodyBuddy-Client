import { InputFieldDefinition } from '@/src/types/exercise';
import { formatSecondsAsMMSS } from '@/src/utils/formatExerciseMetrics';
import OptionalFieldToggle from '@/src/ui/OptionalFieldToggle';
import { Control } from 'react-hook-form';
import { View } from 'react-native';
import StepInput from './StepInput';

interface DynamicSetFieldsProps {
  control: Control<any>;
  basePath: string; // `exercises.${exerciseId}.sets.${index}`
  fields: InputFieldDefinition[];
}

const DynamicSetFields = ({ control, basePath, fields }: DynamicSetFieldsProps) => {
  const requiredFields = fields.filter((field) => !field.optional);
  const optionalFields = fields.filter((field) => field.optional);

  return (
    <View className="w-full gap-4">
      {requiredFields.length > 0 && (
        <View className="w-full flex-row flex-wrap gap-2">
          {requiredFields.map((field) => (
            <View className="flex-1" key={field.key}>
              <StepInput
                control={control}
                name={`${basePath}.${field.key}`}
                label={field.label}
                step={1}
                disabled={false}
                formatValue={field.type === 'duration' ? formatSecondsAsMMSS : undefined}
              />
            </View>
          ))}
        </View>
      )}

      {optionalFields.map((field) => (
        <OptionalFieldToggle key={field.key} label={`הוסף ${field.label}`}>
          <StepInput
            control={control}
            name={`${basePath}.${field.key}`}
            label={field.label}
            step={1}
            disabled={false}
            formatValue={field.type === 'duration' ? formatSecondsAsMMSS : undefined}
            shouldUnregister
          />
        </OptionalFieldToggle>
      ))}
    </View>
  );
};

export default DynamicSetFields;
