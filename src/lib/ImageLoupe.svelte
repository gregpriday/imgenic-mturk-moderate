<script>
    import { onMount, onDestroy } from 'svelte';

    export let src = '';

    let glass = null;
    let zoom = 2.5;
    let glassSize = 350;
    let imgRef;

    onMount(() => {
        imgRef.addEventListener("mouseover", createLoupe);
        imgRef.addEventListener("mouseout", removeLoupe);

        return () => {
            imgRef.removeEventListener("mouseover", createLoupe);
            imgRef.removeEventListener("mouseout", removeLoupe);
        }
    });

    function createLoupe() {
        if (glass) {
            removeLoupe();
        }

        const img = imgRef;
        glass = document.createElement("DIV");
        glass.setAttribute("class", "img-magnifier-glass");
        glass.style.width = glassSize + "px";
        glass.style.height = glassSize + "px";
        glass.style.border = '3px solid #000';
        glass.style.borderRadius = '50%';
        glass.style.cursor = 'none';
        glass.style.position = 'absolute';
        glass.style.pointerEvents = 'none';
        glass.style.zIndex = '9999';
        glass.style.backgroundImage = "url('" + img.src + "')";
        glass.style.backgroundRepeat = "no-repeat";
        glass.style.backgroundSize = (img.width * zoom) + "px " + (img.height * zoom) + "px";
        glass.style.backgroundColor = "white";
        glass.style.boxShadow = "0 0 5px 5px rgba(0, 0, 0, 0.2)";

        img.parentElement.insertBefore(glass, img);

        img.addEventListener("mousemove", moveMagnifier);
        img.addEventListener("touchmove", moveMagnifier);
    }

    function removeLoupe() {
        if (!glass) return;
        imgRef.removeEventListener("mousemove", moveMagnifier);
        imgRef.removeEventListener("touchmove", moveMagnifier);
        glass.remove();
        glass = null;
    }

    function moveMagnifier(e) {
        const img = imgRef;
        const w = glass.offsetWidth / 2;
        const h = glass.offsetHeight / 2;

        e.preventDefault();

        let pos = getCursorPos(e);
        let x = pos.x;
        let y = pos.y;

        glass.style.left = (x - w + window.pageXOffset) + "px";
        glass.style.top = (y - h + window.pageYOffset) + "px";

        glass.style.backgroundPosition = (-((x * zoom) - w)) + "px " + (-((y * zoom) - h)) + "px";
    }

    function getCursorPos(e) {
        const img = imgRef;
        let a, x = 0, y = 0;
        e = e || window.event;
        a = img.getBoundingClientRect();
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;

        return {x, y};
    }
</script>

<div class="tool-wrapper">
    <div class="image-container">
        <img bind:this={imgRef} src={src} alt="Selected Candidate Image" class="candidate-image">
    </div>
</div>

<style lang="scss">
    .tool-wrapper {
        height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e0e0e0;
    }

    .image-container {
        display: inline-block;
        position: relative;

        img {
            max-height: 600px;
            width: auto;
            cursor: none;
            display: block;
        }
    }
</style>
