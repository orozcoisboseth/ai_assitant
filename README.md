# NetSuite AI Assistant

An AI-powered NetSuite Suitelet that converts natural language requests into SuiteQL queries and displays the results in a user-friendly interface.
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/orozcoisboseth/ai_assitant)
## Features

- Natural language search
- AI-driven query interpretation
- Automatic SuiteQL generation
- Paginated results
- Excel export
- PDF export
- Email delivery
- Transaction reporting
- NetSuite SuiteScript 2.1

## How It Works

1. The user enters a question in plain English.
2. AI interprets the request and extracts the search intent.
3. A SuiteQL query is generated automatically.
4. Results are displayed in a paginated NetSuite Suitelet.
5. Results can be exported to Excel, PDF, or sent by email.

## Example Queries

- Show all open invoices.
- Show sales orders created this month.
- Show invoices for customer ABC Corporation.
- Show transactions over 10,000 USD.

## Project Structure

```text
suitelets/
├── sl_agent_ai.js

clients/
├── cl_agent_ai.js

lib/
├── ai_service.js
├── prompt_builder.js
├── query_service.js
├── suiteql_builder.js
```

## Technologies

- SuiteScript 2.1
- SuiteQL
- NetSuite N/llm
- JavaScript

## Screenshots
<img width="1868" height="816" alt="image" src="https://github.com/user-attachments/assets/58e3eb07-c820-4f20-8231-af5d02021c87" />

## Disclaimer

This project is intended for educational and demonstration purposes. Remove any company-specific configurations, credentials, or proprietary information before deploying to production.

## License

MIT License
