<template>
  <RouterLink
    :to="{
      name: Routes.album,
      params: {
        albumhash: track.albumhash,
      },
    }"
    class="trackcard rounded"
  >
    <div class="image">
      <img class="rounded-sm" :src="paths.images.thumb.large + track.image" />
      <PlayBtn :source="playSource" :track="track" />
    </div>
    <div class="tinfo">
      <div v-if="track.help_text" class="rhelp track">
        {{ track.help_text }}
      </div>
      <div class="ttitle ellip">{{ track.title }}</div>
      <ArtistName :albumartists="track.albumartists" :artists="track.artists" />
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { paths } from "@/config";
import { Track } from "@/interfaces";
import { playSources } from "@/enums";

import PlayBtn from "../shared/PlayBtn.vue";
import ArtistName from "../shared/ArtistName.vue";
import { Routes } from "@/router";

defineProps<{
  track: Track;
  playSource: playSources;
}>();

defineEmits<{
  playThis: (index: number) => void;
}>();
</script>

<style lang="scss">
.trackcard {
  padding: $medium;
  cursor: pointer;
  height: max-content;

  .image {
    position: relative;
  }

  $btnwidth: 4rem;

  .play-btn {
    opacity: 0;
    position: absolute;
    width: 4rem;
    bottom: $small;
    left: calc(50% - ($btnwidth / 2));
    transition: all 0.25s;
  }

  &:hover {
    background-color: $gray4;

    .play-btn {
      opacity: 1;
      transform: translateY(-0.75rem);
    }
  }

  .ttitle {
    font-size: 0.9rem;
    margin-top: $small;
  }

  img {
    width: 100%;
  }

  .artist {
    font-size: 0.8rem;
    font-weight: 700;
    opacity: 0.86;
    opacity: 0.75;
  }
}
</style>
