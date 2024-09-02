import React, { useCallback, useEffect, useState } from 'react'
import supabase from '../supaBasecClient'
import styled from 'styled-components';
import RecentPost from './RecentPost';
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {
  NextButton,
  PrevButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'

const RecentPosts = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ stopOnMouseEnter: true, stopOnInteraction: false })])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi);

  const onButtonAutoplayClick = useCallback(
    (callback) => {
      const autoplay = emblaApi?.plugins()?.autoplay
      if (!autoplay) return

      const resetOrStop =
        autoplay.options.stopOnInteraction === false
          ? autoplay.reset
          : autoplay.stop

      resetOrStop()
      callback()
    },
    [emblaApi]
  )
  const toggleAutoplay = useCallback(() => {
    const autoplay = emblaApi?.plugins()?.autoplay
    if (!autoplay) return

    const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play
    setIsPlaying(prev => !prev)
    playOrStop()
  }, [emblaApi])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("Post").select("*");
      if (error) {
        throw error;
      } else {
        data.sort((a, b) => a.PostID - b.PostID)
        // console.log("data => ", data);
        setRecentPosts(data.slice(-4).reverse());
      }
    };

    fetchData();
  }, []);


  return (
    <RecentDiv>
      <h1 style={{ fontSize: '24px' }}>최신글</h1>
      <hr />
      <Embla className='embla' ref={emblaRef}>
        <div className='embla__container'>
          {recentPosts.map(recent => {

            return <RecentPost post={recent} key={`Post${recent.PostID}`} />
          })}


        </div>
      </Embla>
      <EmblaControls className="embla__controls">
        <div className="embla__buttons">
          <PrevButton
            onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
            disabled={prevBtnDisabled}
          />
          <NextButton
            onClick={() => onButtonAutoplayClick(onNextButtonClick)}
            disabled={nextBtnDisabled}
          />
        </div>

        <EmblaActionButton className="embla__play" onClick={toggleAutoplay} type="button">
          {isPlaying ? 'Pause' : 'Play'}
        </EmblaActionButton>
      </EmblaControls>
    </RecentDiv>
  )
}

export default RecentPosts

const RecentDiv = styled.div`
  width: 100%;
  /* height: 500px; */

  padding: 20px;

  background-color: gray;

  hr {
    height: 1px;
    border: none;
    background-color: black;
  }
`

const Embla = styled.div`
  /* width: 100%; */
  overflow: hidden;

  .embla__container {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 100%; /* Each slide covers x % of the viewport */
  grid-gap: 0 20px;
}


.embla__slide {
    flex: 0 0 100%;
    min-width: 0;
  }

.embla__slide:last-child {
  margin-right:20px;
}
`

const EmblaControls = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: end;
`

const EmblaActionButton = styled.button`
  width: 80px;
  height: 30px;

  text-align: center;
  vertical-align: middle;

  border: none;
  border-radius: 30px;

  &:hover {
    background-color: lightgray;
  }
`