import React, { useRef, useState } from "react";
import { View } from "react-native";
import SignaturePad from "react-native-signature-canvas";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import ModalGroup from "@/components/ui/groups/modal-group";

interface SignatureCaptureProps {
  value: string;
  onChange: (base64: string) => void;
}

export default function SignatureCapture({
  value,
  onChange,
}: SignatureCaptureProps) {
  const [open, setOpen] = useState(false);
  const sigRef = useRef<any>(null);

  const style = `.m-signature-pad { box-shadow: none; border: 1px solid #ccc; }
    .m-signature-pad--body { border: none; }
    .m-signature-pad--footer { display: none; }`;

  function handleOK(signature: string) {
    onChange(signature);
    setOpen(false);
  }

  function handleClear() {
    sigRef.current?.clearSignature();
  }

  function handleEmpty() {
    setOpen(false);
  }

  const hasSignature = value && value.length > 10;

  const footer = (
    <View className="flex-row gap-2 justify-end">
      <Button variant="outline" onPress={handleClear}>
        <ButtonText>Clear</ButtonText>
      </Button>
      <Button onPress={() => sigRef.current?.readSignature()}>
        <ButtonText>Save</ButtonText>
      </Button>
    </View>
  );

  return (
    <View className="flex flex-col gap-2">
      {hasSignature && (
        <View className="h-20 border border-border rounded-lg overflow-hidden bg-white">
          <View style={{ flex: 1 }}>
            <img
              src={`data:image/png;base64,${value.replace("data:image/png;base64,", "")}`}
              style={{ width: "100%", height: "100%" }}
              className="w-full h-full object-contain"
            />
          </View>
        </View>
      )}

      <Button variant="outline" onPress={() => setOpen(true)}>
        <ButtonText>
          {hasSignature ? "Re-capture Signature" : "Capture Signature"}
        </ButtonText>
      </Button>

      <ModalGroup
        title="Sign Here"
        description="Draw your signature below."
        size="md"
        isOpen={open}
        onOpenChange={setOpen}
        footer={footer}
        contentClassName="h-80"
      >
        <View className="flex-1 border border-border rounded-lg overflow-hidden mt-2">
          <SignaturePad
            ref={sigRef}
            onOK={handleOK}
            onEmpty={handleEmpty}
            autoClear={false}
            descriptionText=""
            webStyle={style}
          />
        </View>
      </ModalGroup>
    </View>
  );
}
