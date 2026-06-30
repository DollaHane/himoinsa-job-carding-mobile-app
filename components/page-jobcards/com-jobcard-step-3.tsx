import React, { useCallback } from "react";
import { View } from "react-native";
import {
  Control,
  useFieldArray,
} from "react-hook-form";
import { Plus } from "lucide-react-native";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { FormTextArea } from "@/components/ui/forms/form-textarea";
import { FieldLabel } from "@/components/ui/field";
import ComTaskRow from "./com-task-row";
import type { JobcardCreationRequest } from "@/lib/validators/validate-jobcard-create";

interface TabStep3Props {
  control: Control<JobcardCreationRequest>;
}

export default function TabStep3({ control }: TabStep3Props) {
  const {
    fields: taskFields,
    append: appendTask,
    remove: removeTask,
  } = useFieldArray({ control, name: "tasks" });

  const handleAddTask = useCallback(() => {
    appendTask({
      task_step: taskFields.length + 1,
      description: "",
      duration: null,
    });
  }, [appendTask, taskFields.length]);

  return (
    <View className="flex flex-col gap-5">
      <FormTextArea
        control={control}
        name="work_description"
        label="Work Description"
        placeholder="Describe work to be accomplished"
        isRequired
      />

      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <FieldLabel>Tasks</FieldLabel>
          <Button variant="outline" size="sm" onPress={handleAddTask}>
            <ButtonIcon as={Plus} className="mr-1 h-3 w-3" />
            <ButtonText>Add Task</ButtonText>
          </Button>
        </View>

        {taskFields.length === 0 && (
          <Text className="text-sm text-text-muted">
            No tasks added. Click &ldquo;Add Task&rdquo; to add tasks to this
            jobcard.
          </Text>
        )}

        {taskFields.map((field, i) => (
          <ComTaskRow
            key={field.id}
            control={control}
            index={i}
            onRemove={() => removeTask(i)}
          />
        ))}
      </View>
    </View>
  );
}
