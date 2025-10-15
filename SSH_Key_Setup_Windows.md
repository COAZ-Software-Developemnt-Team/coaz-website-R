# SSH Key Setup Guide for Windows

This guide will walk you through generating an SSH key on Windows, retrieving it, and adding it to your GitHub account.

## Prerequisites

- Windows 10/11 with PowerShell or Command Prompt
- Git installed on your system
- A GitHub account

## Step 1: Generate SSH Key

### Option A: Using PowerShell/Command Prompt

1. Open **PowerShell** or **Command Prompt**
2. Navigate to your project directory or run from anywhere
3. Generate a new SSH key:

```powershell
ssh-keygen -t ed25519 -C "nicolendhlovu62@gmail.com"
```

**Example:**
```powershell
ssh-keygen -t ed25519 -C "nicolendhlovu62@gmail.com"
```

### Option B: Generate with Custom Name (Recommended for Multiple Accounts)

```powershell
ssh-keygen -t ed25519 -C "your-email@example.com" -f $env:USERPROFILE\.ssh\id_ed25519_username
```

**Example:**
```powershell
ssh-keygen -t ed25519 -C "D-nicole62@users.noreply.github.com" -f $env:USERPROFILE\.ssh\id_ed25519_dnicole
```

### What You'll See:
```
Generating public/private ed25519 key pair.
Enter file in which to save the key (C:\Users\YourName\.ssh\id_ed25519): [Press Enter]
Enter passphrase (empty for no passphrase): [Press Enter or type a passphrase]
Enter same passphrase again: [Press Enter or repeat passphrase]
```

**Output:**
```
Your identification has been saved in C:\Users\YourName\.ssh\id_ed25519_dnicole
Your public key has been saved in C:\Users\YourName\.ssh\id_ed25519_dnicole.pub
The key fingerprint is:
SHA256:ht6VyeFq0OZFktQMkIX77a0h6hjE6tDpQNrwZk9sQHs D-nicole62@users.noreply.github.com
```

## Step 2: Retrieve Your SSH Public Key

### Method 1: Using PowerShell
```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub
```

**For custom named keys:**
```powershell
Get-Content $env:USERPROFILE\.ssh\id_ed25519_dnicole.pub
```

### Method 2: Using Command Prompt
```cmd
type %USERPROFILE%\.ssh\id_ed25519.pub
```

### Method 3: Using Notepad
```powershell
notepad $env:USERPROFILE\.ssh\id_ed25519.pub
```

### Example Output:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIPz0Suhv8fgKj8uTyr+yv/sp2S0crTLDI5BHg+9+wPJ7 D-nicole62@users.noreply.github.com
```

## Step 3: Add SSH Key to GitHub

### 3.1 Copy Your Public Key
1. Run the command to display your public key
2. **Copy the entire output** (starts with `ssh-ed25519` and ends with your email)

### 3.2 Add to GitHub Account
1. Go to [GitHub.com](https://github.com) and **sign in** to your account
2. Click your **profile picture** (top right) → **Settings**
3. In the left sidebar, click **"SSH and GPG keys"**
4. Click **"New SSH key"** (green button)
5. Fill out the form:
   - **Title**: Give it a descriptive name (e.g., "Windows PC", "Work Laptop")
   - **Key type**: Leave as "Authentication Key"
   - **Key**: Paste your public key here
6. Click **"Add SSH key"**
7. Enter your GitHub password to confirm

## Step 4: Configure SSH (For Multiple Keys)

If you have multiple SSH keys, create a config file:

### Create SSH Config File
```powershell
notepad $env:USERPROFILE\.ssh\config
```

### Add Configuration:
```
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_dnicole

# For multiple accounts, you can add:
Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_work
```

## Step 5: Test Your SSH Connection

```powershell
ssh -T git@github.com
```

**Expected Success Output:**
```
Hi YourUsername! You've successfully authenticated, but GitHub does not provide shell access.
```

**For custom key:**
```powershell
ssh -i $env:USERPROFILE\.ssh\id_ed25519_dnicole -T git@github.com
```

## Step 6: Configure Git to Use Your Account

Set your Git username and email for the repository:

```powershell
git config --local user.name "D-nicole62"
git config --local user.email "D-nicole62@users.noreply.github.com"
```

## Step 7: Clone/Push with SSH

### Change existing repository to use SSH:
```powershell
git remote set-url origin git@github.com:username/repository.git
```

**Example:**
```powershell
git remote set-url origin git@github.com:COAZ-Software-Developemnt-Team/coaz-website-R.git
```

### Clone new repository with SSH:
```powershell
git clone git@github.com:username/repository.git
```

## Troubleshooting

### Common Issues:

1. **"Permission denied (publickey)"**
   - Make sure you copied the **public key** (`.pub` file), not the private key
   - Verify the key is added to the correct GitHub account
   - Check that your GitHub username has access to the repository

2. **"Bad owner or permissions"** (on some systems)
   ```powershell
   icacls $env:USERPROFILE\.ssh\id_ed25519 /inheritance:r /grant:r "%username%":"(R)"
   ```

3. **Multiple GitHub accounts**
   - Use different SSH keys for different accounts
   - Configure SSH config file with different hosts

### Verify Git Configuration:
```powershell
git config --list | findstr user
git remote -v
```

## Security Best Practices

1. **Never share your private key** (`id_ed25519` - without `.pub`)
2. **Use passphrases** for additional security
3. **Use different SSH keys** for different accounts/purposes
4. **Regularly rotate keys** for enhanced security
5. **Remove old keys** from GitHub when no longer needed

## Summary

Your SSH key consists of two files:
- **Private key**: `id_ed25519` (keep this secret!)
- **Public key**: `id_ed25519.pub` (this is what you add to GitHub)

The public key is safe to share and goes on GitHub, while the private key stays on your computer and should never be shared.