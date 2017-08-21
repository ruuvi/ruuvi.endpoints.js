# Ruuvi Endpoints
This is a node JS implementation for sending and receiving data into Ruuvi sensor endpoints.

Status of the protocol and this implementation is pre-alpha / unofficial, so expect breaking changes

# Program flow
Ble UART messages are passed to parset, which determines their intented endpoints. 
The parsed message is the routed to appropriate endpoint handler and interpreted there.


