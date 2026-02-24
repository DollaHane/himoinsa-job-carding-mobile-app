import React from 'react';
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@/components/ui/modal';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon, CloseIcon } from '@/components/ui/icon';
import { Ticket } from '@/types/ticket';

interface TicketModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  ticket: Ticket;
}

export function TicketModal({ showModal, setShowModal, ticket }: TicketModalProps) {
  return (
    <Modal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
      }}
      size="lg"
    >
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <VStack>
            <Heading size="lg">Ticket #{ticket.ticketid}</Heading>
            <Text className="text-sm text-muted">
              {ticket.subject}
            </Text>
          </VStack>
          <ModalCloseButton>
            <Icon as={CloseIcon} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
            <VStack space="lg">
              {/* Message */}
              <Box>
                <Text className="text-sm font-semibold text mb-2">
                  Message
                </Text>
                <Box className="bg-background-subtle p-4 rounded-lg">
                  <Text className="text-sm text">
                    {ticket.message || 'No message provided'}
                  </Text>
                </Box>
              </Box>

              {/* Service */}
              {ticket.service && (
                <Box>
                  <Text className="text-xs text-muted mb-1">Service</Text>
                  <Text className="text-sm font-semibold text">
                    {ticket.service}
                  </Text>
                </Box>
              )}

              {/* Ticket Key */}
              <Box>
                <Text className="text-xs text-muted mb-1">Ticket Key</Text>
                <Text className="text-sm font-mono text">
                  {ticket.ticketkey}
                </Text>
              </Box>

              {/* Admin Replying */}
              <HStack className="justify-between">
                <Box className="flex-1">
                  <Text className="text-xs text-muted mb-1">Admin Replying</Text>
                  <Text className="text-sm font-semibold text">
                    {ticket.adminreplying === '1' ? 'Yes' : 'No'}
                  </Text>
                </Box>
                <Box className="flex-1">
                  <Text className="text-xs text-muted mb-1">Admin</Text>
                  <Text className="text-sm font-semibold text">
                    {ticket.admin || 'N/A'}
                  </Text>
                </Box>
              </HStack>

              {/* Read Status */}
              <HStack className="justify-between">
                <Box className="flex-1">
                  <Text className="text-xs text-muted mb-1">Client Read</Text>
                  <Text className="text-sm font-semibold text">
                    {ticket.clientread === '1' ? 'Yes' : 'No'}
                  </Text>
                </Box>
                <Box className="flex-1">
                  <Text className="text-xs text-muted mb-1">Admin Read</Text>
                  <Text className="text-sm font-semibold text">
                    {ticket.adminread === '1' ? 'Yes' : 'No'}
                  </Text>
                </Box>
              </HStack>

              {/* IDs */}
              <HStack className="justify-between">
                <Box className="flex-1">
                  <Text className="text-xs text-muted mb-1">User ID</Text>
                  <Text className="text-sm font-mono text">
                    {ticket.userid}
                  </Text>
                </Box>
                <Box className="flex-1">
                  <Text className="text-xs text-muted mb-1">Contact ID</Text>
                  <Text className="text-sm font-mono text">
                    {ticket.contactid}
                  </Text>
                </Box>
              </HStack>

              {/* Project ID */}
              {ticket.project_id !== '0' && (
                <Box>
                  <Text className="text-xs text-muted mb-1">Project ID</Text>
                  <Text className="text-sm font-mono text">
                    {ticket.project_id}
                  </Text>
                </Box>
              )}

              {/* Assigned */}
              {ticket.assigned !== '0' && (
                <Box>
                  <Text className="text-xs text-muted mb-1">Assigned To</Text>
                  <Text className="text-sm font-semibold text">
                    {ticket.assigned}
                  </Text>
                </Box>
              )}

              {/* Line Manager */}
              {ticket.line_manager !== '0' && (
                <Box>
                  <Text className="text-xs text-muted mb-1">Line Manager</Text>
                  <Text className="text-sm font-semibold text">
                    {ticket.line_manager}
                  </Text>
                </Box>
              )}

              {/* Milestone */}
              {ticket.milestone !== '0' && (
                <Box>
                  <Text className="text-xs text-muted mb-1">Milestone</Text>
                  <Text className="text-sm font-semibold text">
                    {ticket.milestone}
                  </Text>
                </Box>
              )}
            </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            onPress={() => {
              setShowModal(false);
            }}
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
