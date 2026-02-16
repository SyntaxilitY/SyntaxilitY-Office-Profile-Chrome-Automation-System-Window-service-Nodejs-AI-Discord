## Office Profile | Chrome Automation

Automated Chrome profile login and logout system triggered by Discord attendance messages.

This service listens to a specific Discord channel and performs Chrome profile actions based on the keywords:

* **Checked in** → Creates Chrome profiles and logs into Google accounts
* **Checked out** → Closes Chrome and deletes those profiles

The system runs continuously on the office laptop as a background Node.js service.

### Features

* Real-time Discord message listener
* Filters messages only from configured owner name
* Works per-channel
* Automatically creates Chrome user profiles
* Logs into Google accounts using Puppeteer automation
* Deletes Chrome profiles to enforce logout
* Can run as Windows background process or startup service

### Project Structure
```bash
Office_Profile_Automation/
│
├── bot/
│   ├── discordListener.js        # Discord gateway listener
│   └── commandParser.js          # Detects Checked in / out
│
├── chrome/
│   ├── profileManager.js         # Create/remove Chrome profiles
│   └── chromeLauncher.js         # Puppeteer login automation
│
├── config/
│   └── accounts.json             # Owner + email credentials
│
├── service/
│   └── backgroundRunner.js       # Entry point service
│
├── .env                          # Secrets and configuration
├── package.json
└── README.md
```

### Configuration
1. Accounts.json
```bash
config/accounts.json
```
Defines the Discord owner and Google accounts to manage.

Example:
```json
{
  "owner": "Tariq Mehmood",
  "emails": [
    {
      "email": "abc@gmail.com",
      "password": "pass@123"
    },
    {
      "email": "xyz@gmail.com",
      "password": "pass@786"
    }
  ]
}
```

### INSTALLATION

1. Install Node.js 18+
2. cd Office Profile Automation
3. npm install

4. Create Discord bot
5. Put token in .env
6. Put channel ID in .env

RUN
```bash
npm start
```

OPTIONAL: Add to Windows Startup using Task Scheduler

---

Use **NSSM (Non-Sucking Service Manager)**. It is the standard way to run Node apps as real Windows services.

---

## Step 1 — Download NSSM

Download from:
[https://nssm.cc/download](https://nssm.cc/download)

Extract it, for example:

```bash
C:\nssm\nssm.exe
```

---

## Step 2 — Build your start command

Your app runs with:

```bash
node service/backgroundRunner.js
```

So we configure NSSM to execute Node with that file.

Find Node path:

```bash
where node
```

Example result:

```bash
C:\Program Files\nodejs\node.exe
```

---

## Step 3 — Install service

Run **Command Prompt as Administrator** and execute:

```bash
C:\nssm\nssm.exe install OfficeProfileAutomation
```

A window opens.

Fill fields:

### Application tab

**Path**

```bash
C:\Program Files\nodejs\node.exe
```

**Startup directory**

```bash
C:\Tariq_Mehmood_Projects\Office_Profile_Automation
```

**Arguments**

```bash
service/backgroundRunner.js
```

---

### Details tab

Service name:

```bash
Office Profile Automation
```

Startup type:

```bash
Automatic
```

---

### Log tab (important)

Set logs so you can debug later:

**stdout**

```bash
C:\<USER>\Office_Profile_Automation\logs\out.log
```

**stderr**

```bash
C:\<USER>\Office_Profile_Automation\logs\err.log
```

Create the `logs` folder manually first.

Click **Install Service**

---

## Step 4 — Start service

Run:

```bash
net start OfficeProfileAutomation
```

or open **services.msc** and start it from there.

---

## Step 5 — Verify

Check:

```bash
logs/out.log
logs/err.log
```

Your Discord bot should connect automatically and run in the background even after logout or reboot.

---

## ⚠️ Important Notes for Puppeteer + Services

1. Services run in **Session 0**, not your desktop session
   Chrome UI will NOT be visible

2. If Chrome must open visibly, service must run as:

```
Log On → This account → your Windows user
```

in service properties.

3. Ensure `.env` file path is absolute or loaded correctly.