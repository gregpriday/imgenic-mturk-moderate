<script>
    import { onMount, onDestroy } from 'svelte';
    import {generateCloudFlareUrl} from "./lib/util.js";
    import ImageLoupe from "./lib/ImageLoupe.svelte";
    import Instructions from "./lib/Instructions.svelte";
    import Rating from "./lib/Rating.svelte";
    import ImageGallery from "./lib/ImageGallery.svelte";  // Import the new component

    let hit = JSON.parse(document.getElementById('hit-data').value);
    let selected = 0;

    const selectImage = (index) => {
        selected = index;
    }

    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            selected = (selected + 1) % hit.length;
        } else if (event.key === 'ArrowLeft') {
            selected = (selected - 1 + hit.length) % hit.length;
        }
    };

    onMount(() => {
        window.addEventListener('keydown', handleKeyDown);
    });

    onDestroy(() => {
        window.removeEventListener('keydown', handleKeyDown);
    });
</script>

<div class="mturk-wrapper">
    <div class="content-wrapper">
        <div class="image-wrapper">
            {#key selected}
                <ImageLoupe src={generateCloudFlareUrl(hit[selected].image)} />
                <div class="rating-wrapper">
                    <Rating />
                </div>
            {/key}
        </div>

        <div class="rating-info">
            <Instructions rating={0}></Instructions>
        </div>
    </div>

    <ImageGallery {hit} {selected} {selectImage} />
</div>

<style lang="scss">
    .mturk-wrapper {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .content-wrapper {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }

    .image-wrapper {
        flex: 1;
        padding: 10px;
    }

    .rating-info {
        flex: 1;
        padding: 10px;
    }
</style>
