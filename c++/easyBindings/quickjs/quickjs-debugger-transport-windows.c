#ifdef _WIN32

#include "quickjs-debugger.h"
#include "quickjs-libc.h"

#include <winsock2.h>
#include <windows.h>
#include <ws2tcpip.h>
#include <stdio.h>
#include <string.h>
#include <assert.h>

#if defined(_MSC_VER)
#pragma comment (lib, "Ws2_32.lib")
#endif


//static SOCKET server_sock = INVALID_SOCKET;
//static SOCKET client_sock = INVALID_SOCKET;
static int wsa_inited = 0;

struct js_transport_data {
    int handle;
} js_transport_data;

static size_t js_transport_read(void* udata, char* buffer, size_t length) {
    
    struct js_transport_data* data = (struct js_transport_data*)udata;
    if (data->handle <= 0)
        return -1;

    if (length == 0)
        return -2;

    if (buffer == NULL)
        return -3;

    int ret = recv(data->handle, buffer, (int)length, 0);
   // JS_Print(buffer);
    if (ret < 0)
        return -4;

    if (ret == 0)
        return -5;

    if (ret > length)
        return -6;

    return ret;
}

static size_t js_transport_write(void* udata, const char* buffer, size_t length) {
   // JS_Print(buffer);
    struct js_transport_data* data = (struct js_transport_data*)udata;
    if (data->handle <= 0)
        return -1;

    if (length == 0)
        return -2;

    if (buffer == NULL)
        return -3;

    int ret = send(data->handle, buffer, (int)length, 0);
    if (ret <= 0 || ret > length)
        return -4;

    return ret;
}

static size_t js_transport_peek(void* udata) {
    u_long avail;
    int rc;

    struct js_transport_data* data = (struct js_transport_data*)udata;
    if (data->handle <= 0)
        return -1;

    avail = 0;
    rc = ioctlsocket(data->handle, FIONREAD, &avail);
    if (rc != 0) {
        return -3;
    }
    else {
        if (avail == 0) {
            return 0;  /* nothing to read */
        }
        else {
            return 1;  /* something to read */
        }
    }

    // has data
    return 1;
}

static void js_transport_close(JSContext* ctx, void* udata) {
    struct js_transport_data* data = (struct js_transport_data*)udata;
    if (data->handle>0) {
        (void)closesocket(data->handle);  
    }
    if (wsa_inited) {
        WSACleanup();
        wsa_inited = 0;
    }
    free(udata);
}

// todo: fixup asserts to return errors.
static struct sockaddr_in js_debugger_parse_sockaddr(const char* address) {
    char* port_string = strstr(address, ":");
    assert(port_string);

    int port = atoi(port_string + 1);
    assert(port);

    char host_string[256];
    strcpy(host_string, address);
    host_string[port_string - address] = 0;

   
    struct hostent* host = gethostbyname(host_string);
    assert(host);
    struct sockaddr_in addr;

    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    memcpy((char*)&addr.sin_addr.s_addr, (char*)host->h_addr, host->h_length);
    addr.sin_port = htons(port);

    return addr;
}

void js_debugger_connect(JSContext* ctx, const char* address) {
    //JS_Print(address);
    struct sockaddr_in addr = js_debugger_parse_sockaddr(address);

    int client = socket(AF_INET, SOCK_STREAM, 0);
    assert(client > 0);

    assert(!connect(client, (const struct sockaddr*) & addr, sizeof(addr)));

    struct js_transport_data* data = (struct js_transport_data*)malloc(sizeof(struct js_transport_data));
    memset(data, 0, sizeof(js_transport_data));
    data->handle = client;
    js_debugger_attach(ctx, js_transport_read, js_transport_write, js_transport_peek, js_transport_close, data);
}

void js_debugger_wait_connection(JSContext* ctx, const char* address) {
   // JS_Print(address);
    struct sockaddr_in addr = js_debugger_parse_sockaddr(address);

    int server = socket(AF_INET, SOCK_STREAM, 0);
    assert(server >= 0);

    int reuseAddress = 1;
    assert(setsockopt(server, SOL_SOCKET, SO_REUSEADDR, (const char*)&reuseAddress, sizeof(reuseAddress)) >= 0);

    assert(bind(server, (struct sockaddr*) & addr, sizeof(addr)) >= 0);

    listen(server, 1);

    struct sockaddr_in client_addr;
    socklen_t client_addr_size = (socklen_t)sizeof(addr);
    int client = accept(server, (struct sockaddr*) & client_addr, &client_addr_size);
    close(server);
    assert(client >= 0);

    struct js_transport_data* data = (struct js_transport_data*)malloc(sizeof(struct js_transport_data));
    memset(data, 0, sizeof(js_transport_data));
    data->handle = client;
    js_debugger_attach(ctx, js_transport_read, js_transport_write, js_transport_peek, js_transport_close, data);
}
#endif // _WIN32
