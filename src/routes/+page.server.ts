import type { PageServerLoad } from "./$types";

import { type BaseChannel, Client } from "youtubei";

export const load: PageServerLoad = async ({ url }) => {
  const youtube = new Client();
  const CHANNEL_NAME = url.searchParams.get("channel") || "9arm.";

  const channel = (await youtube.findOne(CHANNEL_NAME, {
    type: "channel",
  })) as BaseChannel;
  const lives = await channel.live.next();
  const latestLive = lives[0];

  return {
    isLive: latestLive.isLive,
    channelName: channel.name,
  };
};
