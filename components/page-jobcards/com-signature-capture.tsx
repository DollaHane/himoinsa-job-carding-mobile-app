import React, { useRef } from "react";
import { View } from "react-native";
import SignaturePad from "react-native-signature-canvas";
import { Button, ButtonText } from "@/components/ui/button";

interface SignatureCaptureProps {
  value: string;
  onChange: (base64: string) => void;
  onActiveChange?: (active: boolean) => void;
}

const style = `* {
    -webkit-user-select: none;
    -webkit-touch-callout: none;
  }
  html, body {
    margin: 0; padding: 0;
    width: 100%; height: 100%;
    overflow: hidden;
    overscroll-behavior: none;
  }
  .m-signature-pad {
    box-shadow: none; border: none;
    width: 100%; height: 100%;
    display: flex; flex-direction: column;
  }
  .m-signature-pad--body {
    border: none; flex: 1;
    overflow: hidden;
  }
  .m-signature-pad--body canvas {
    width: 100% !important; height: 100% !important;
    touch-action: none;
  }
  .m-signature-pad--footer { display: none; }`;

export default function SignatureCapture({
  value,
  onChange,
  onActiveChange,
}: SignatureCaptureProps) {
  const sigRef = useRef<any>(null);

  function handleOK(signature: string) {
    onActiveChange?.(false);
    onChange(signature);
  }

  function handleEmpty() {
    onActiveChange?.(false);
    onChange("");
  }

  function handleClear() {
    onActiveChange?.(false);
    sigRef.current?.clearSignature();
    onChange("");
  }

  return (
    <View className="flex flex-col gap-2">
      <View className="h-40 overflow-hidden rounded-lg border border-border bg-white">
        <SignaturePad
          ref={sigRef}
          onOK={handleOK}
          onEmpty={handleEmpty}
          onBegin={() => onActiveChange?.(true)}
          onEnd={() => onActiveChange?.(false)}
          autoClear={false}
          descriptionText=""
          webStyle={style}
          style={{ flex: 1 }}
        />
      </View>
      <Button variant="outline" size="sm" onPress={handleClear}>
        <ButtonText>Clear</ButtonText>
      </Button>
    </View>
  );
}
