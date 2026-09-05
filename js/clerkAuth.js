/**
 * BHARAT ALPHA TERMINAL - CLERK AUTHENTICATION CONTROLLER
 * Integrates Clerk JavaScript SDK with custom Obsidian Terminal theme
 * App ID: app_3ItzSpbmLJbgvobflkQpa4RszNT
 */

const CLERK_PUBLISHABLE_KEY = 'pk_test_Y2l2aWwtYnVmZmFsby00NjM3LmNsZXJrLmFjY291bnRzLmRldiQ';

export class ClerkAuthController {
  constructor() {
    this.clerk = null;
    this.user = null;
  }

  async init() {
    const loadingEl = document.getElementById('clerk-loading');
    const signedInEl = document.getElementById('clerk-signed-in');
    const signedOutEl = document.getElementById('clerk-signed-out');
    const userButtonEl = document.getElementById('clerk-user-button');
    const userNameEl = document.getElementById('clerk-user-name');
    const signInBtn = document.getElementById('clerkSignInBtn');
    const signUpBtn = document.getElementById('clerkSignUpBtn');

    // Poll for Clerk SDK to be injected and ready on window
    const getClerk = () => {
      return new Promise((resolve) => {
        if (window.Clerk) return resolve(window.Clerk);
        const interval = setInterval(() => {
          if (window.Clerk) {
            clearInterval(interval);
            resolve(window.Clerk);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          resolve(window.Clerk || null);
        }, 8000);
      });
    };

    const clerkInstance = await getClerk();
    if (!clerkInstance) {
      console.warn('[Clerk] Clerk SDK script failed to load or timed out.');
      if (loadingEl) {
        loadingEl.innerHTML = `
          <button id="clerkRetryBtn" class="text-error font-micro-badge flex items-center gap-1 hover:underline">
            <span class="material-symbols-outlined text-[13px]">sync_problem</span>
            <span>AUTH OFFLINE</span>
          </button>
        `;
      }
      return;
    }

    this.clerk = (typeof clerkInstance === 'function') 
      ? new clerkInstance(CLERK_PUBLISHABLE_KEY) 
      : clerkInstance;

    try {
      await this.clerk.load({
        appearance: {
          variables: {
            colorPrimary: '#ff9800',
            colorBackground: '#10141a',
            colorText: '#dfe2eb',
            colorInputBackground: '#181c22',
            colorInputText: '#dfe2eb',
            colorTextSecondary: '#dbc2ad'
          },
          elements: {
            modalBackdrop: 'bg-black/80 backdrop-blur-sm',
            card: 'bg-[#10141a] border border-[#31353c] shadow-2xl text-[#dfe2eb]',
            headerTitle: 'font-mono text-[#ffc081] font-bold',
            headerSubtitle: 'text-[#dbc2ad] text-xs',
            formButtonPrimary: 'bg-[#ff9800] hover:bg-[#ffb870] text-[#2c1600] font-bold text-xs uppercase tracking-wider',
            footerActionLink: 'text-[#00e0fa] hover:underline'
          }
        }
      });

      this.updateState();

      // Listen for session/user changes
      this.clerk.addListener(() => {
        this.updateState();
      });

      // Bind Sign In button
      if (signInBtn) {
        signInBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.clerk.openSignIn();
        });
      }

      // Bind Sign Up button
      if (signUpBtn) {
        signUpBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.clerk.openSignUp();
        });
      }

      console.log('🏛️ Bharat Alpha Terminal: Clerk Auth successfully initialized.');
    } catch (err) {
      console.error('[Clerk] Error initializing Clerk SDK:', err);
      if (loadingEl) {
        loadingEl.innerHTML = `<span class="text-error font-micro-badge text-micro-badge">AUTH ERROR</span>`;
      }
    }
  }

  updateState() {
    const loadingEl = document.getElementById('clerk-loading');
    const signedInEl = document.getElementById('clerk-signed-in');
    const signedOutEl = document.getElementById('clerk-signed-out');
    const userButtonEl = document.getElementById('clerk-user-button');
    const userNameEl = document.getElementById('clerk-user-name');
    const deskRoleEl = document.getElementById('deskUserRole');

    if (loadingEl) loadingEl.classList.add('hidden');

    if (this.clerk && this.clerk.user) {
      this.user = this.clerk.user;
      if (signedOutEl) signedOutEl.classList.add('hidden');
      if (signedInEl) {
        signedInEl.classList.remove('hidden');
        signedInEl.classList.add('flex');
      }

      const displayName = this.user.fullName || this.user.firstName || this.user.primaryEmailAddress?.emailAddress?.split('@')[0] || 'DESK PM';
      if (userNameEl) {
        userNameEl.textContent = displayName.toUpperCase();
      }
      if (deskRoleEl) {
        deskRoleEl.textContent = `USER: ${displayName.toUpperCase()} (CIO)`;
      }

      if (userButtonEl) {
        userButtonEl.innerHTML = '';
        this.clerk.mountUserButton(userButtonEl, {
          afterSignOutUrl: '/',
          appearance: {
            variables: {
              colorPrimary: '#ff9800',
              colorBackground: '#10141a',
              colorText: '#dfe2eb'
            }
          }
        });
      }
    } else {
      this.user = null;
      if (signedInEl) signedInEl.classList.add('hidden');
      if (signedOutEl) {
        signedOutEl.classList.remove('hidden');
        signedOutEl.classList.add('flex');
      }
      if (deskRoleEl) {
        deskRoleEl.textContent = 'DESK: MACRO/CIO';
      }
    }
  }
}
