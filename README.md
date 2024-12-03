# API Response Comparer

A modern web application for comparing API responses with powerful modification capabilities.

## Features

- Compare two API responses side by side
- Support for all HTTP methods (GET, POST, PUT, DELETE)
- Custom headers support
- Request body support for POST/PUT methods
- JavaScript-based response modifiers
- Real-time difference highlighting
- Modern and responsive UI

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Monaco Editor for code editing
- Axios for API requests
- React Split for resizable panels

## Getting Started

### Development

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker

#### Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.x or later

#### Running with Docker Compose

1. Clone the repository:
```bash
git clone <repository-url>
cd api-response-comparer
```

2. Build and start the containers:
```bash
docker compose up --build
```

The application will be available at [http://localhost:3010](http://localhost:3010).

To run in detached mode (background):
```bash
docker compose up -d --build
```

To stop the containers:
```bash
docker compose down
```

To view logs:
```bash
docker compose logs -f
```

#### Development with Docker

For development with hot-reload:
```bash
docker compose -f docker-compose.dev.yml up --build
```

## Usage

1. Enter API URLs in both panels
2. Configure request methods, headers, and body as needed
3. Write response modifiers in JavaScript if required
4. Send requests and view the differences

## Response Modifiers

You can modify API responses before comparison using JavaScript. The modifier function receives the response as an argument and should return the modified response.

Example modifier:
```javascript
// Remove sensitive fields
const newResponse = { ...response };
delete newResponse.token;
delete newResponse.secretKey;
return newResponse;
```

## Contributing

Feel free to open issues and pull requests for any improvements or bug fixes.
