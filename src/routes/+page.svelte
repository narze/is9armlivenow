<script lang="ts">
  import { onMount } from "svelte"
  import type { PageData } from "./$types"
  import { parseDate } from "chrono-node"

  export let data: PageData

  let nextLiveDate: Date
  let nextLiveInSeconds = 0

  onMount(() => {
    if (data.channelName == "9arm") {
      if (!data.isLive) {
        // countdown to 10pm of saturday & 9am of wednesday
        const thisSaturday = parseDate(
          "this saturday 10pm",
          { timezone: "ICT" },
          {
            forwardDate: true,
          }
        )

        const thisWednesday = parseDate(
          "this wednesday 9am",
          { timezone: "ICT" },
          {
            forwardDate: true,
          }
        )
        // console.log(thisSaturday, thisWednesday)

        // Determine next live date by what comes first
        nextLiveDate =
          thisSaturday!.getTime() < thisWednesday!.getTime()
            ? thisSaturday!
            : thisWednesday!

        const now = new Date()
        nextLiveInSeconds = Math.max(0, nextLiveDate.getTime() - now.getTime())

        setInterval(() => {
          const now = new Date()
          nextLiveInSeconds = Math.max(
            0,
            nextLiveDate.getTime() - now.getTime()
          )
        }, 1000)
      }
    }
  })
</script>

<center>
  <h1>is {data.channelName} live now?</h1>
  <p style="font-size: 200px; padding: 0; margin: 0;">
    {data.isLive ? "YES" : "NO"}
  </p>

  {#if !data.isLive && nextLiveInSeconds > 0}
    Expect next live stream in {Math.floor(
      nextLiveInSeconds / 1000 / 60 / 60 / 24
    )}
    days {Math.floor(nextLiveInSeconds / 1000 / 60 / 60) % 24} hours
    {Math.floor(nextLiveInSeconds / 1000 / 60) % 60} minutes {Math.floor(
      nextLiveInSeconds / 1000
    ) % 60} seconds
  {/if}
</center>
