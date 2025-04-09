import * as signalR from '@microsoft/signalr';

let connection: signalR.HubConnection | null = null;

export async function startConnection() {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
      console.warn('SignalR already connected.');
      return; 
  }

  connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:19081/SnakesGameApp/RealTimeBroadcast/gameHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
    })  
      .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
              console.log(`Reconnecting... Attempt #${retryContext.previousRetryCount + 1}`);
              return Math.min(1000 * (retryContext.previousRetryCount + 1), 5000); 
          }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

  connection.onclose(async (error) => {
      console.error('SignalR disconnected. Reason:', error?.message || 'Unknown reason.');
      await startConnection();
  });

  try {
      await connection.start();
      console.log('SignalR connected successfully.');
  } catch (error) {
      console.error('SignalR connection error:', error);
      setTimeout(startConnection, 5000);
  }
}

export function getConnection(): signalR.HubConnection | null {
  return connection;
}

export async function stopConnection() {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
      await connection.stop();
      console.log('SignalR connection stopped.');
  }
}