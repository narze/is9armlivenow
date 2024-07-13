<script lang="ts">
  import { onMount } from "svelte"
  import type { PageData } from "./$types"
  import { parseDate } from "chrono-node"

  export let data: PageData

  let nextLiveDate: Date
  let nextLiveInSeconds = 0

  const images = groupByThree(
    [
      "https://media.tenor.com/rXshGVAdcI4AAAAM/9arm.gif",
      "https://media.tenor.com/JxX_esk4W3AAAAAM/9arm.gif",
      "https://media.tenor.com/fRXxPdhp1OkAAAAM/9arm.gif",
      "https://media.tenor.com/bn3Ui1RzBiYAAAAM/9arm-omg.gif",
      "https://media.tenor.com/LwUDlSaaChAAAAAM/9arm-armzi.gif",
      "https://media.tenor.com/bEEj6gHS9ngAAAAM/9arm-hack.gif",
      "https://media.tenor.com/nThrW3ZxAQQAAAAM/9arm.gif",
      "https://media.tenor.com/KEPo3OqimgcAAAAM/%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%97%E0%B8%B8%E0%B8%99-9arm.gif",
      "https://media.tenor.com/3374ROjb_2UAAAAM/9arm.gif",
      "https://media.tenor.com/tlUzV4bJdpYAAAAM/9arm.gif",
      "https://media.tenor.com/EScag4bGyiQAAAAM/9arm.gif",
      "https://media.tenor.com/ZzytmYkIJTcAAAAM/9arm-point.gif",
      "https://media.tenor.com/RQhpSyTW1IkAAAAM/9arm.gif",
      "https://media.tenor.com/vXf9IHKBIasAAAAM/9arm-nod.gif",
      "https://media.tenor.com/JbAOotbrS5wAAAAM/9arm.gif",
      "https://media.tenor.com/4le8a1BTkSsAAAAM/9arm-armzi.gif",
      "https://media.tenor.com/VwA0mZRDBAkAAAAM/9arm-%E0%B8%99%E0%B8%B2%E0%B8%A2%E0%B8%97%E0%B8%B8%E0%B8%99.gif",
      "https://media.tenor.com/e_EsgMrSKTYAAAAM/9arm.gif",
      "https://media.tenor.com/7tlFFJjycN4AAAAM/9arm-amd-9arm.gif",
      "https://media.tenor.com/hsAyg0PNN58AAAAM/9arm-nod.gif",
      "https://media.tenor.com/kSQKcoAarIkAAAAM/9arm.gif",
    ].sort(() => Math.random() - 0.5)
  )

  function groupByThree([a, b, c, ...rest]: string[]): string[][] {
    if (rest.length === 0) return [[a, b, c].filter((x) => x !== undefined)]
    return [[a, b, c]].concat(groupByThree(rest))
  }

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

    // Refresh every 1 minute unless already live
    if (data.isLive) return
    setInterval(() => {
      location.reload()
    }, 60 * 1000)
  })
</script>

<main
  class="flex flex-col items-center justify-center h-[100svh] overflow-hidden"
>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:flex gap-2 fixed -z-10">
    {#each images as imageGroup}
      <div class="grid gap-2 place-content-evenly">
        {#each imageGroup as image}
          <div class="">
            <img src={image} alt="9arm" class="h-auto max-w-full" />
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <center class="flex flex-col gap-4 text-black bg-white/80 p-4">
    <h1>is {data.channelName} live now?</h1>
    <p class="text-[35vw] md:text-[20vw] p-0 m-0">
      {data.isLive ? "YES!" : "NO"}
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
    {#if !data.isLive}
      <a
        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-500 underline">Watch this instead</a
      >
    {/if}

    {#if data.isLive}
      <a
        href="https://www.youtube.com/watch?v={data.videoId}"
        target="_blank"
        rel="noopener noreferrer"
        class="text-blue-500 underline"
      >
        Watch on YouTube
      </a>
    {/if}
  </center>
</main>
