import { defineCloudflareConfig } from '@opennextjs/cloudflare';

// Incremental cache disabled for initial deploy.
// Re-enable with r2IncrementalCache override after the site is live and stable.
export default defineCloudflareConfig({});
