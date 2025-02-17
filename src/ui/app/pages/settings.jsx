import { Button } from '@chakra-ui/button';
import {
  Box,
  IconButton,
  Text,
  useColorMode,
  Switch as SwitchCurrency,
  Image,
  SkeletonCircle,
  Spinner,
  Checkbox,
  Input,
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SunIcon,
  SmallCloseIcon,
} from '@chakra-ui/icons';
import { Select } from '@chakra-ui/select';
import React from 'react';
import {
  getCurrency,
  getWhitelisted,
  removeWhitelisted,
  resetStorage,
  setCurrency,
} from '../../../api/extension';
import Account from '../components/account';
import { Route, Switch, useHistory } from 'react-router-dom';
import { useSettings } from '../components/settingsProvider';
import { NETWORK_ID, NODE } from '../../../config/config';
import ConfirmModal from '../components/confirmModal';

const Settings = () => {
  const history = useHistory();
  return (
    <>
      <Box
        minHeight="100vh"
        display="flex"
        alignItems="center"
        flexDirection="column"
        position="relative"
      >
        <Account />
        <Box position="absolute" top="24" left="6">
          <IconButton
            rounded="md"
            onClick={() => history.goBack()}
            variant="ghost"
            icon={<ChevronLeftIcon boxSize="7" />}
          />
        </Box>

        <Switch>
          <Route exact path="/settings" component={Overview} />
          <Route exact path="/settings/general" component={GeneralSettings} />
          <Route exact path="/settings/whitelisted" component={Whitelisted} />
          <Route exact path="/settings/network" component={Network} />
        </Switch>
      </Box>
    </>
  );
};

const Overview = () => {
  const history = useHistory();
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box height="10" />
      <Text fontSize="lg" fontWeight="bold">
        Settings
      </Text>
      <Box height="10" />
      <Button
        justifyContent="space-between"
        width="65%"
        rightIcon={<ChevronRightIcon />}
        variant="ghost"
        onClick={() => {
          history.push('/settings/general');
        }}
      >
        General settings
      </Button>
      <Box height="1" />
      <Button
        justifyContent="space-between"
        width="65%"
        rightIcon={<ChevronRightIcon />}
        variant="ghost"
        onClick={() => {
          history.push('/settings/whitelisted');
        }}
      >
        Whitelisted sites
      </Button>
      <Box height="1" />
      <Button
        justifyContent="space-between"
        width="65%"
        rightIcon={<ChevronRightIcon />}
        variant="ghost"
        onClick={() => {
          history.push('/settings/network');
        }}
      >
        Network
      </Button>
    </>
  );
};

const GeneralSettings = () => {
  const { settings, setSettings } = useSettings();
  const { toggleColorMode } = useColorMode();
  const ref = React.useRef();
  return (
    <>
      <Box height="10" />
      <Text fontSize="lg" fontWeight="bold">
        General settings
      </Text>
      <Box height="6" />
      <IconButton
        size="sm"
        rounded="md"
        onClick={() => {
          toggleColorMode();
        }}
        icon={<SunIcon />}
      />

      <Box height="6" />
      <Box display="flex" alignItems="center" justifyContent="center">
        <Text>USD</Text>
        <Box width="2" />
        <SwitchCurrency
          defaultChecked={settings.currency !== 'usd'}
          onChange={(e) => {
            if (e.target.checked) {
              setSettings({ ...settings, currency: 'eur' });
            } else {
              setSettings({ ...settings, currency: 'usd' });
            }
          }}
        />
        <Box width="2" />
        <Text>EUR</Text>
      </Box>
      <Box height="10" />
      <Button
        size="xs"
        colorScheme="red"
        variant="link"
        onClick={() => ref.current.openModal()}
      >
        Reset Wallet
      </Button>
      <ConfirmModal
        info={
          <Box mb="4" fontSize="sm" width="full">
            The wallet will be reset.{' '}
            <b>Make sure you have written down your seed phrase.</b> It's the
            only way to recover your current wallet! <br />
            Type your password below, if you want to continue.
          </Box>
        }
        ref={ref}
        sign={(password) => resetStorage(password)}
        onConfirm={async (status, signedTx) => {
          if (status === true) window.close();
        }}
      />
    </>
  );
};

const Whitelisted = () => {
  const [whitelisted, setWhitelisted] = React.useState(null);
  const getData = () =>
    getWhitelisted().then((whitelisted) => {
      setWhitelisted(whitelisted);
    });
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box height="10" />
      <Text fontSize="lg" fontWeight="bold">
        Whitelisted sites
      </Text>
      <Box height="6" />
      {whitelisted ? (
        whitelisted.length > 0 ? (
          whitelisted.map((origin, index) => (
            <Box
              mb="2"
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              width="65%"
            >
              <Image
                width="24px"
                src={`chrome://favicon/size/16@2x/${origin}`}
                fallback={<SkeletonCircle width="24px" height="24px" />}
              />
              <Text>{origin}</Text>
              <SmallCloseIcon
                cursor="pointer"
                onClick={async () => {
                  await removeWhitelisted(origin);
                  // const filteredWhitelist = whitelisted.filter(
                  //   (o) => o != origin
                  // );
                  // setWhitelisted(filteredWhitelist);
                  getData();
                }}
              />
            </Box>
          ))
        ) : (
          <Box
            mt="200"
            width="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="GrayText"
          >
            No whitelisted sites
          </Box>
        )
      ) : (
        <Box
          mt="200"
          width="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner color="teal" speed="0.5s" />
        </Box>
      )}

      <Box height="6" />
    </Box>
  );
};

const Network = () => {
  const { settings, setSettings } = useSettings();
  return (
    <>
      <Box height="10" />
      <Text fontSize="lg" fontWeight="bold">
        Network
      </Text>
      <Box height="6" />
      <Box display="flex" alignItems="center" justifyContent="center">
        <Text>Mainnet</Text>
        <Box width="2" />
        <SwitchCurrency
          defaultChecked={settings.network.id !== NETWORK_ID.mainnet}
          onChange={(e) => {
            if (e.target.checked) {
              setSettings({
                ...settings,
                network: { id: NETWORK_ID.testnet, node: NODE.testnet },
              });
            } else {
              setSettings({
                ...settings,
                network: { id: NETWORK_ID.mainnet, node: NODE.mainnet },
              });
            }
          }}
        />
        <Box width="2" />
        <Text>Testnet</Text>
      </Box>
      <Box height="8" />
      <Box display="flex" alignItems="center" justifyContent="center">
        <Checkbox disabled={true} size="md" /> <Box width="2" />{' '}
        <Text>Custom node</Text>
      </Box>
      <Box height="3" />
      <Input
        disabled={true}
        width="70%"
        size="sm"
        placeholder="http://localhost:8000"
      />
    </>
  );
};

export default Settings;
