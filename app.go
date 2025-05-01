package main

import (
	"context"
	"divazaap/src/server"
	"fmt"
	"log"
	"os"
	"os/exec"
	go_runtime "runtime"
	"strconv"
	"sync"

	"github.com/apache/thrift/lib/go/thrift"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx          context.Context
	mu           sync.Mutex
	currentSrv   *server.RunningServer // Reference to the currently running server
	serverCancel context.CancelFunc    // Cancel function to stop the server
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx // GUI application context
}

// RunServer starts a new server and stops the previous one if running
func (a *App) RunServer(zaapPort string, httpPort string, authAddress string) error {
	a.mu.Lock()
	defer a.mu.Unlock()

	// Stop the previous server if running
	if a.currentSrv != nil {
		log.Println("Stopping the previous server...")
		a.currentSrv.Stop() // Gracefully stop the previous server
		a.currentSrv = nil
		a.serverCancel()
	}

	// Create a new context with cancel function for the new server
	serverCtx, cancel := context.WithCancel(context.Background())
	a.serverCancel = cancel

	// Start the new server
	runningServer, err := server.RunServer(
		thrift.NewTTransportFactory(),
		thrift.NewTBinaryProtocolFactoryConf(&thrift.TConfiguration{}),
		fmt.Sprintf("127.0.0.1:%s", zaapPort),
		fmt.Sprintf("127.0.0.1:%s", httpPort),
		authAddress,
		serverCtx,
	)
	if err != nil {
		log.Printf("Failed to start the server: %v", err)
		return err
	}

	a.currentSrv = runningServer // Keep reference to the current server
	return nil
}

func (a *App) StopServer() error {
	// Stop the previous server if running
	if a.currentSrv != nil {
		log.Println("Stopping the previous server...")
		a.currentSrv.Stop() // Gracefully stop the previous server
		a.currentSrv = nil
		a.serverCancel()
	}
	return nil
}

func (a *App) SelectClientPath() (string, error) {
	// Check if OS is windows
	if go_runtime.GOOS == "windows" {
		return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
			Filters: []runtime.FileFilter{
				{
					DisplayName: "Dofus.exe",
					Pattern:     "*.exe",
				},
			},
		})
	}

	return runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{})
}

func (a *App) RunGame(clientPath string, hash string, gameToken string, instanceId string, zaapPort string, httpPort string, authPort string) {
	if a.currentSrv == nil || a.currentSrv.Handler == nil {
		log.Println("Trying to start game but server is not running or handler is nil")
		return
	}
	instanceIdInt, err := strconv.Atoi(instanceId)
	if err != nil {
		log.Println("Error converting instanceId to int:", err)
		return
	}
	a.currentSrv.Handler.Register(gameToken, int32(instanceIdInt), hash)

	// Define the executable and arguments
	cmd := exec.Command(clientPath, "--port", zaapPort, "--gameName", "dofus", "--gameRelease", "dofus3",
		"--instanceId", instanceId, "--hash", hash, "--canLogin", "true", "--langCode", "fr",
		"--autoConnectType", "0", "--connectionPort", authPort, "--configUrl", fmt.Sprintf("http://127.0.0.1:%s/divazaap.json", httpPort))

	// Set environment variables
	cmd.Env = append(os.Environ(), "ZAAP_PORT="+zaapPort, "ZAAP_GAME=dofus",
		"ZAAP_RELEASE=dofus3", "ZAAP_INSTANCE_ID="+instanceId, "ZAAP_HASH="+hash)

	// Run the command, but ignore its output
	err = cmd.Start()
	if err != nil {
		fmt.Printf("Game run error: %v\n", err)
	} else {
		fmt.Println("Game ran successfully!")
	}
}
