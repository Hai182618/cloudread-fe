#!/usr/bin/env python3
"""
Simple HTTP Server for Frontend Development
Serves static files (HTML, CSS, JS) and enables CORS
"""

import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse


class CORSRequestHandler(SimpleHTTPRequestHandler):
    """HTTP Request Handler with CORS support"""
    
    def end_headers(self):
        """Add CORS headers to all responses"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
        self.send_header('Access-Control-Max-Age', '3600')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests"""
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        """Custom logging format"""
        print(f"[{self.log_date_time_string()}] {format % args}")
    
    def translate_path(self, path):
        """Serve files from current directory"""
        path = urlparse(path).path
        
        # Remove leading slash
        if path.startswith('/'):
            path = path[1:]
        
        # Serve index.html for root
        if not path or path == '':
            path = 'html/index.html'
        
        # Serve from current directory
        return os.path.join(os.getcwd(), path)


def run_server(host='localhost', port=3000):
    """Start the HTTP server"""
    
    # Change to FE directory
    fe_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(fe_dir)
    
    server_address = (host, port)
    httpd = HTTPServer(server_address, CORSRequestHandler)
    
    print("=" * 60)
    print("🚀 Frontend Server Started")
    print("=" * 60)
    print(f"📍 Server: http://{host}:{port}")
    print(f"📁 Root:   {fe_dir}")
    print(f"🌐 Pages:  http://{host}:{port}/html/login.html")
    print(f"          http://{host}:{port}/html/index.html")
    print(f"          http://{host}:{port}/html/admin-books.html")
    print("=" * 60)
    print("Backend API: http://localhost:8080")
    print("=" * 60)
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✋ Server stopped by user")
        httpd.server_close()
        sys.exit(0)


if __name__ == '__main__':
    import argparse
    
    parser = argparse.ArgumentParser(description='Frontend Development Server')
    parser.add_argument('--host', default='localhost', help='Host (default: localhost)')
    parser.add_argument('--port', type=int, default=3000, help='Port (default: 3000)')
    
    args = parser.parse_args()
    
    run_server(args.host, args.port)
