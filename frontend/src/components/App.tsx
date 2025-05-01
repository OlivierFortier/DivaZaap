import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import useUserSettings from "../hooks/useUserSettings";
import {
  RunServer,
  StopServer,
  SelectClientPath,
  RunGame,
} from "../../wailsjs/go/main/App";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

function App() {
  const [isServerLoading, setIsServerLoading] = useState<boolean>(false);
  const [isServerStarted, setIsServerStarted] = useState<boolean>(false);
  const [isGameStarting, setIsGameStarting] = useState<boolean>(false);
  const [instanceIdCount, setInstanceIdCount] = useState<number>(1);

  const zaapPort = useUserSettings((state) => state.zaapPort);
  const setZaapPort = useUserSettings((state) => state.setZaapPort);
  const httpPort = useUserSettings((state) => state.httpPort);
  const setHttpPort = useUserSettings((state) => state.setHttpPort);
  const clientPath = useUserSettings((state) => state.clientPath);
  const setClientPath = useUserSettings((state) => state.setClientPath);
  const clientToken = useUserSettings((state) => state.clientToken);
  const setClientToken = useUserSettings((state) => state.setClientToken);
  const authIp = useUserSettings((state) => state.authIp);
  const setAuthIp = useUserSettings((state) => state.setAuthIp);
  const authPort = useUserSettings((state) => state.authPort);
  const setAuthPort = useUserSettings((state) => state.setAuthPort);

  const startServer = () => {
    if (isServerLoading || isServerStarted) {
      return;
    }
    setInstanceIdCount(1);
    setIsServerLoading(true);
    RunServer(`${zaapPort}`, `${httpPort}`, `${authIp}:${authPort}`)
      .then(() => {
        console.log("server started");
        setIsServerStarted(true);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsServerLoading(false);
      });
  };

  const stopServer = () => {
    setIsServerLoading(true);
    StopServer()
      .then(() => {
        console.log("server stopped");
        setIsServerStarted(false);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsServerLoading(false);
      });
  };

  const runGame = () => {
    setIsGameStarting(true);
    RunGame(
      clientPath,
      uuidv4(),
      clientToken,
      `${instanceIdCount}`,
      `${zaapPort}`,
      `${httpPort}`,
      `${authPort}`
    )
      .then(() => {
        console.log("game started");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        // Sleep 2 seconds
        setInstanceIdCount(instanceIdCount + 1);
        setTimeout(() => {
          setIsGameStarting(false);
        }, 2000);
      });
  };

  return (
    <div className="flex min-h-screen h-screen p-2 gap-2">
      <Card fullWidth>
        <CardHeader>
          <h2>Serveur Zaap</h2>
        </CardHeader>
        <CardBody className="flex gap-2">
          <div className="flex gap-2">
            <Input
              type="number"
              label="Port Zaap"
              defaultValue={`${zaapPort}`}
              value={`${zaapPort}`}
              onValueChange={(value) => setZaapPort(parseInt(value))}
              isDisabled={isServerLoading || isServerStarted}
            />
            <Input
              type="number"
              label="Port HTTP"
              defaultValue={`${httpPort}`}
              value={`${httpPort}`}
              onValueChange={(value) => setHttpPort(parseInt(value))}
              isDisabled={isServerLoading || isServerStarted}
            />
          </div>

          <span>Rédiriger vers :</span>
          <div className="flex gap-2">
            <Input
              type="string"
              label="IP Auth"
              defaultValue={authIp}
              value={authIp}
              onValueChange={(value) => setAuthIp(value)}
              isDisabled={isServerLoading || isServerStarted}
            />
            <Input
              type="number"
              label="Port Auth"
              defaultValue={`${authPort}`}
              value={`${authPort}`}
              onValueChange={(value) => setAuthPort(parseInt(value))}
              isDisabled={isServerLoading || isServerStarted}
            />
          </div>

          <div className="flex gap-2 items-center justify-center">
            <Button
              color="primary"
              onClick={startServer}
              isDisabled={isServerLoading || isServerStarted}
            >
              Start
            </Button>
            <Button
              color="danger"
              onClick={stopServer}
              isDisabled={isServerLoading || !isServerStarted}
            >
              Stop
            </Button>
          </div>
        </CardBody>
      </Card>
      <Card fullWidth>
        <CardHeader>
          <h2>Client</h2>
        </CardHeader>
        <CardBody className="flex gap-2">
          <div className="flex gap-2 items-center">
            <Input
              type="string"
              label="Chemin vers l'exécutable Dofus"
              value={clientPath}
              disabled
            />
            <Button
              onClick={() => {
                SelectClientPath()
                  .then((path) => {
                    console.log("Selected path: ", path);
                    if (!path.includes("Dofus")) {
                      return;
                    }
                    setClientPath(path);
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              }}
            >
              Parcourir...
            </Button>
          </div>
          <div className="flex gap-2 items-center">
            <Input
              type="string"
              label="Token"
              value={clientToken}
              onValueChange={(value) => setClientToken(value)}
            />
            <Button
              onClick={() => {
                setClientToken(uuidv4());
              }}
            >
              Aléatoire
            </Button>
          </div>

          <Button
            color="primary"
            onClick={runGame}
            isDisabled={
              isServerLoading ||
              !isServerStarted ||
              isGameStarting ||
              clientPath.length === 0 ||
              clientToken.length === 0
            }
          >
            Lancer Dofus
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}

export default App;
