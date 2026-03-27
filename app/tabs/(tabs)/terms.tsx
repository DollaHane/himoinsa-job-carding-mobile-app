import React from 'react';
import { Center } from '@/components/ui/center';
import { VStack } from '@/components/ui/vstack';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ScrollView } from '@/components/ui/scroll-view';

export default function TermsPage() {
  return (
    <ScrollView className="flex-1">
      <Center className="flex-1">
        <Box className="mx-auto w-full max-w-md px-4 pt-16 pb-8">
          <VStack space="lg">
            <Heading className="text-3xl font-bold text-primary dark:text-white mb-4">
              Terms of Use
            </Heading>

            <Box className="bg-background rounded-2xl p-4 pb-28">
              <VStack space="md">
                <Text className="text-sm text-primary dark:text-primary">
                  Last updated March 27, 2026
                </Text>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    Agreement to Our Legal Terms
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    We are HIMOINSA S.L. ('Company', 'we', 'us', or 'our'), a company
                    registered in Spain at 57 Edison Street, Las Mezquitas Industrial Park,
                    Madrid 28906.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    We operate the mobile application Himoinsa Directors Portal (the
                    'App'), as well as any other related products and services that refer or
                    link to these legal terms (the 'Legal Terms') (collectively, the
                    'Services').
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    You can contact us by phone at +27 (0)82 461 6054, email at
                    braddon@networkassociates.co.za, or by mail to 57 Edison Street, Las
                    Mezquitas Industrial Park, Madrid 28906, Spain.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    These Legal Terms constitute a legally binding agreement made between
                    you, whether personally or on behalf of an entity ('you'), and HIMOINSA
                    S.L., concerning your access to and use of the Services. You agree that
                    by accessing the Services, you have read, understood, and agreed to be
                    bound by all of these Legal Terms.
                  </Text>
                  <Text className="text-sm font-bold text-primary dark:text-white">
                    IF YOU DO NOT AGREE WITH ALL OF THESE LEGAL TERMS, THEN YOU ARE
                    EXPRESSLY PROHIBITED FROM USING THE SERVICES AND YOU MUST DISCONTINUE
                    USE IMMEDIATELY.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    Table of Contents
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    1. Our Services{'\n'}
                    2. Intellectual Property Rights{'\n'}
                    3. User Representations{'\n'}
                    4. Prohibited Activities{'\n'}
                    5. User Generated Contributions{'\n'}
                    6. Contribution Licence{'\n'}
                    7. Mobile Application Licence{'\n'}
                    8. Services Management{'\n'}
                    9. Privacy Policy{'\n'}
                    10. Term and Termination{'\n'}
                    11. Modifications and Interruptions{'\n'}
                    12. Governing Law{'\n'}
                    13. Dispute Resolution{'\n'}
                    14. Corrections{'\n'}
                    15. Disclaimer{'\n'}
                    16. Limitations of Liability{'\n'}
                    17. Indemnification{'\n'}
                    18. User Data{'\n'}
                    19. Electronic Communications, Transactions, and Signatures{'\n'}
                    20. Miscellaneous{'\n'}
                    21. Contact Us
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    1. Our Services
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    The information provided when using the Services is not intended for
                    distribution to or use by any person or entity in any jurisdiction or
                    country where such distribution or use would be contrary to law or
                    regulation or which would subject us to any registration requirement
                    within such jurisdiction or country. Accordingly, those persons who
                    choose to access the Services from other locations do so on their own
                    initiative and are solely responsible for compliance with local laws, if
                    and to the extent local laws are applicable.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    2. Intellectual Property Rights
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary font-semibold">
                    Our Intellectual Property
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    We are the owner or the licensee of all intellectual property rights in
                    our Services, including all source code, databases, functionality,
                    software, website designs, audio, video, text, photographs, and graphics
                    in the Services (collectively, the 'Content'), as well as the
                    trademarks, service marks, and logos contained therein (the 'Marks').
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    Our Content and Marks are protected by copyright and trademark laws (and
                    various other intellectual property rights and unfair competition laws)
                    and treaties around the world.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    The Content and Marks are provided in or through the Services 'AS IS'
                    for your personal, non-commercial use or internal business purpose only.
                  </Text>
                  
                  <Text className="text-sm text-primary dark:text-primary font-semibold mt-4">
                    Your Use of Our Services
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    Subject to your compliance with these Legal Terms, including the
                    'PROHIBITED ACTIVITIES' section below, we grant you a non-exclusive,
                    non-transferable, revocable licence to:
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary ml-4">
                    • access the Services{'\n'}
                    • download or print a copy of any portion of the Content to which you
                    have properly gained access,{'\n'}
                    solely for your personal, non-commercial use or internal business
                    purpose.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    Except as set out in this section or elsewhere in our Legal Terms, no
                    part of the Services and no Content or Marks may be copied, reproduced,
                    aggregated, republished, uploaded, posted, publicly displayed, encoded,
                    translated, transmitted, distributed, sold, licensed, or otherwise
                    exploited for any commercial purpose whatsoever, without our express
                    prior written permission.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    3. User Representations
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    By using the Services, you represent and warrant that: (1) you have the
                    legal capacity and you agree to comply with these Legal Terms; (2) you
                    are not a minor in the jurisdiction in which you reside; (3) you will
                    not access the Services through automated or non-human means, whether
                    through a bot, script or otherwise; (4) you will not use the Services
                    for any illegal or unauthorised purpose; and (5) your use of the
                    Services will not violate any applicable law or regulation.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    Account registration is not available in the App. Accounts are
                    provisioned outside the App by authorized administrators.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    If you provide any information that is untrue, inaccurate, not current,
                    or incomplete, we have the right to suspend or terminate your account
                    and refuse any and all current or future use of the Services (or any
                    portion thereof).
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    4. Prohibited Activities
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    You may not access or use the Services for any purpose other than that
                    for which we make the Services available. The Services may not be used
                    in connection with any commercial endeavours except those that are
                    specifically endorsed or approved by us.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    As a user of the Services, you agree not to:
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary ml-4">
                    • Systematically retrieve data or other content from the Services{'\n'}
                    • Trick, defraud, or mislead us and other users{'\n'}
                    • Circumvent, disable, or otherwise interfere with security-related
                    features{'\n'}
                    • Disparage, tarnish, or otherwise harm the Services{'\n'}
                    • Use any information obtained from the Services to harass, abuse, or
                    harm another person{'\n'}
                    • Make improper use of our support services{'\n'}
                    • Use the Services in a manner inconsistent with applicable laws{'\n'}
                    • Engage in unauthorised framing of or linking to the Services{'\n'}
                    • Upload or transmit viruses or malicious code{'\n'}
                    • Engage in any automated use of the system such as using scripts or
                    data mining robots
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    5. User Generated Contributions
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    The Services does not offer users to submit or post content.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    6. Contribution Licence
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    You and Services agree that we may access, store, process, and use any
                    information and personal data that you provide and your choices
                    (including settings).
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    By submitting suggestions or other feedback regarding the Services, you
                    agree that we can use and share such feedback for any purpose without
                    compensation to you.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    7. Mobile Application Licence
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary font-semibold">
                    Use Licence
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    If you access the Services via the App, then we grant you a revocable,
                    non-exclusive, non-transferable, limited right to install and use the
                    App on wireless electronic devices owned or controlled by you, and to
                    access and use the App on such devices strictly in accordance with the
                    terms and conditions of this mobile application licence contained in
                    these Legal Terms.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    8. Services Management
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    We reserve the right, but not the obligation, to: (1) monitor the
                    Services for violations of these Legal Terms; (2) take appropriate legal
                    action against anyone who violates the law or these Legal Terms; (3)
                    refuse, restrict access to, limit the availability of, or disable any
                    of your Contributions or any portion thereof; (4) remove from the
                    Services or otherwise disable all files and content that are excessive
                    in size or burdensome to our systems; and (5) otherwise manage the
                    Services in a manner designed to protect our rights and property.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    9. Privacy Policy
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    We care about data privacy and security. By using the Services, you
                    agree to be bound by our Privacy Policy posted on the Services, which
                    is incorporated into these Legal Terms. The Services are hosted in South
                    Africa and Portugal.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    10. Term and Termination
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    These Legal Terms shall remain in full force and effect while you use
                    the Services. We reserve the right to deny access to and use of the
                    Services to any person for any reason or for no reason.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    If we terminate or suspend your account for any reason, you are
                    prohibited from attempting to access the Services using another
                    account, including a fake or borrowed name, or the name of any third
                    party.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    11. Modifications and Interruptions
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    We reserve the right to change, modify, or remove the contents of the
                    Services at any time or for any reason at our sole discretion without
                    notice. However, we have no obligation to update any information on our
                    Services.
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    We cannot guarantee the Services will be available at all times. We may
                    experience hardware, software, or other problems requiring maintenance,
                    resulting in interruptions, delays, or errors. You agree that we have
                    no liability for any loss, damage, or inconvenience caused by your
                    inability to access or use the Services during any downtime.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    12. Governing Law
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    These Legal Terms shall be governed by and defined following the laws
                    of South Africa. HIMOINSA S.L. and yourself irrevocably consent that
                    the courts of South Africa shall have exclusive jurisdiction to resolve
                    any dispute which may arise in connection with these Legal Terms.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    13. Dispute Resolution
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary font-semibold">
                    Informal Negotiations
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    To expedite resolution and control the cost of any dispute, controversy,
                    or claim related to these Legal Terms, the Parties agree to first
                    attempt to negotiate any Dispute informally for at least thirty (30)
                    days before initiating arbitration.
                  </Text>
                  
                  <Text className="text-sm text-primary dark:text-primary font-semibold mt-4">
                    Binding Arbitration
                  </Text>
                  <Text className="text-sm text-primary dark:text-primary">
                    Any dispute arising out of or in connection with these Legal Terms
                    shall be referred to and finally resolved by the International
                    Commercial Arbitration Court. The language of the proceedings shall be
                    English. The governing law shall be substantive law of South Africa.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    14. Corrections
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    There may be information on the Services that contains typographical
                    errors, inaccuracies, or omissions. We reserve the right to correct any
                    errors, inaccuracies, or omissions and to change or update the
                    information on the Services at any time, without prior notice.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    15. Disclaimer
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    THE SERVICES ARE PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE
                    THAT YOUR USE OF THE SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST
                    EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    16. Limitations of Liability
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO
                    YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL,
                    EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST
                    PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR
                    USE OF THE SERVICES.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    17. Indemnification
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    You agree to defend, indemnify, and hold us harmless from and against
                    any loss, damage, liability, claim, or demand, including reasonable
                    attorneys' fees and expenses, made by any third party due to or arising
                    out of: (1) use of the Services; (2) breach of these Legal Terms; (3)
                    any breach of your representations and warranties; (4) your violation of
                    the rights of a third party; or (5) any overt harmful act toward any
                    other user of the Services.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    18. User Data
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    We will maintain certain data that you transmit to the Services for the
                    purpose of managing the performance of the Services. Although we perform
                    regular routine backups of data, you are solely responsible for all data
                    that you transmit or that relates to any activity you have undertaken
                    using the Services.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    19. Electronic Communications, Transactions, and Signatures
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    Visiting the Services, sending us emails, and completing online forms
                    constitute electronic communications. You consent to receive electronic
                    communications and agree that all agreements, notices, disclosures, and
                    other communications we provide to you electronically satisfy any legal
                    requirement that such communication be in writing.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    20. Miscellaneous
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    These Legal Terms and any policies or operating rules posted by us on
                    the Services constitute the entire agreement and understanding between
                    you and us. Our failure to exercise or enforce any right or provision of
                    these Legal Terms shall not operate as a waiver of such right or
                    provision.
                  </Text>
                </VStack>

                <VStack space="md">
                  <Heading className="text-lg font-bold text-primary dark:text-white">
                    21. Contact Us
                  </Heading>
                  <Text className="text-sm text-primary dark:text-primary">
                    In order to resolve a complaint regarding the Services or to receive
                    further information regarding use of the Services, please contact us
                    at:{'\n\n'}
                    HIMOINSA S.L.{'\n'}
                    57 Edison Street{'\n'}
                    Las Mezquitas Industrial Park{'\n'}
                    Madrid 28906{'\n'}
                    Spain{'\n'}
                    Phone: +27 (0)82 461 6054{'\n'}
                    Email: braddon@networkassociates.co.za
                  </Text>
                </VStack>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
}