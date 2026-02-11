import React from "react";
import { Box } from "../ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "../ui/text";
import { Heading } from "../ui/heading";
import { Menu, MenuItem, MenuItemLabel } from "../ui/menu";
import { Button } from "../ui/button";
import { Icon } from "../ui/icon";
import { MoreHorizontal, Briefcase, Clock } from "lucide-react-native";
import { Ticket } from "@/types/ticket";
interface TicketCardProps {
  ticket: Ticket;
  handleOpenModal: (ticket: Ticket) => void;
}

export default function TicketCard({ ticket, handleOpenModal }: TicketCardProps) {
  return (
    <Box
      key={ticket.id}
      className="bg-background-0 rounded-2xl shadow-sm border border-secondary-300 overflow-hidden mb-6"
    >
      <Box className="p-3 bg-blue-950">
        <HStack className="items-center justify-between">
          <HStack className="items-center gap-2">
            <Text className="text-md font-mono text-white">TICKET</Text>
            <Text className="text-md font-mono font-bold text-white">#{ticket.ticketid}</Text>
          </HStack>
          <HStack className="items-center gap-3">
            <Menu
              placement="bottom left"
              offset={10}
              crossOffset={20}
              trigger={({ ...triggerProps }) => {
                return (
                  <Button
                    {...triggerProps}
                    size="icon"
                    className="p-1 rounded-full bg-transparent hover:bg-transparent active:bg-transparent shadow-none"
                  >
                    <MoreHorizontal
                      color="white"
                      size={28}
                    />
                  </Button>
                );
              }}
            >
              <MenuItem
                key="More Information"
                textValue="More Information"
                onPress={() => handleOpenModal(ticket)}
              >
                <Icon
                  as={Briefcase}
                  size="sm"
                  className="mr-2"
                />
                <MenuItemLabel size="sm">More Information</MenuItemLabel>
              </MenuItem>
            </Menu>
          </HStack>
        </HStack>
      </Box>

      <VStack
        className="p-3"
        space="md"
      >
        <Heading className="text-lg font-bold text-primary-800">{ticket.subject}</Heading>

        <HStack className="items-start gap-3">
          <HStack className="items-start gap-3">
            <Box className="w-8 h-8 rounded-lg bg-background-100 items-center justify-center">
              <Icon
                as={Clock}
                className="text-primary-600 dark:text-primary-400"
                size="sm"
              />
            </Box>
            <VStack>
              <Text className="text-xs text-primary-500 dark:text-primary-400 mb-0.5">Last Reply</Text>
              <Text className="text-sm font-semibold text-primary-800 dark:text-white">
                {ticket.lastreply === "0000-00-00 00:00:00" ? "No Reply Yet" : ticket.lastreply}
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </VStack>

      <Box className="p-3 bg-background-0 border-t-2 border-dashed border-background-100">
        <HStack className="items-center justify-between">
          <VStack>
            <Text className="text-xs text-primary-800 mb-0.5">Created</Text>
            <Text className="text-xs font-mono text-primary-600">{ticket.date}</Text>
          </VStack>
          <VStack className="items-end">
            <Text className="text-xs text-primary-400 mb-0.5">Ticket ID</Text>
            <Text className="text-xs font-mono font-bold text-primary-600">#{ticket.ticketid}</Text>
          </VStack>
        </HStack>
      </Box>
    </Box>
  );
}
