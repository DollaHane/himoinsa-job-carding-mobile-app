import React, { useRef, useState } from "react";
import { View } from "react-native";
import SignaturePad from "react-native-signature-canvas";
import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
} from "@/components/ui/modal";
import { Heading } from "@/components/ui/heading";

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

  return (
    <View className="flex flex-col gap-2">
      {hasSignature && (
        <View className="h-20 border border-border rounded-lg overflow-hidden bg-white">
          <View
            style={{
              flex: 1,
              // Use a simple View with background image approach since RN Image doesn't do base64 data URIs easily
              backgroundColor: "white",
            }}
          />
        </View>
      )}

      <Button variant="outline" onPress={() => setOpen(true)}>
        <ButtonText>
          {hasSignature ? "Re-capture Signature" : "Capture Signature"}
        </ButtonText>
      </Button>

      <Modal isOpen={open} onClose={handleEmpty} size="full">
        <ModalBackdrop />
        <ModalContent className="h-[85%] mt-auto rounded-t-3xl">
          <ModalHeader>
            <View className="flex-row w-full items-center justify-between">
              <Heading size="lg" className="text-foreground">
                Sign Here
              </Heading>
              <View className="flex-row gap-3">
                <Button variant="outline" size="sm" onPress={handleClear}>
                  <ButtonText>Clear</ButtonText>
                </Button>
                <Button
                  size="sm"
                  onPress={() => sigRef.current?.readSignature()}
                >
                  <ButtonText>Save</ButtonText>
                </Button>
              </View>
            </View>
          </ModalHeader>
          <View className="flex-1 mb-6 overflow-hidden mx-[-24px] px-6">
            <View className="flex-1 border border-border rounded-xl overflow-hidden bg-white">
              <SignaturePad
                ref={sigRef}
                onOK={handleOK}
                onEmpty={handleEmpty}
                autoClear={false}
                descriptionText=""
                webStyle={style}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </ModalContent>
      </Modal>
    </View>
  );
}
