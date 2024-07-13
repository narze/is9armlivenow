<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<center>
  <h1>is {data.channelName} live now?</h1>
  <p style="font-size: 200px; padding: 0; margin: 0;">
    {data.isLive ? "YES" : "NO"}.
  </p>
</center>
