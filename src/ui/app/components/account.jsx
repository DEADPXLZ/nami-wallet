import React from 'react';
import { avatarToImage, getCurrentAccount } from '../../../api/extension';
import { Box, Text } from '@chakra-ui/layout';

import Logo from '../../../assets/img/logoWhite.svg';
import { Image, useColorModeValue } from '@chakra-ui/react';
import AvatarLoader from './avatarLoader';

const Account = () => {
  const avatarBg = useColorModeValue('white', 'gray.800');
  const panelBg = useColorModeValue('teal.400', 'teal.900');
  const [account, setAccount] = React.useState(null);

  React.useEffect(() => {
    getCurrentAccount().then((account) => setAccount(account));
  }, []);

  return (
    <Box
      height="16"
      roundedBottom="3xl"
      background={panelBg}
      shadow="md"
      width="full"
      position="relative"
    >
      <Box
        zIndex="2"
        position="absolute"
        top="13px"
        left="6"
        width="10"
        height="10"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Image draggable={false} src={Logo} width="24px" />
      </Box>
      <Box
        zIndex="2"
        position="absolute"
        top="13px"
        right="6"
        rounded="full"
        background={avatarBg}
        width="10"
        height="10"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <AvatarLoader avatar={account && account.avatar} width="76%" />
      </Box>
      <Box
        zIndex="1"
        position="absolute"
        width="full"
        top="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text color="white" fontSize="lg" isTruncated={true} maxWidth="210px">
          {account && account.name}
        </Text>
      </Box>
    </Box>
  );
};

export default Account;
