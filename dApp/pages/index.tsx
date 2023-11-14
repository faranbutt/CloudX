import Image from "next/image";
import image1 from '../public/images/tmp5szz2naz.png';
import image2 from '../public/images/tmpbw4bcxkf.png';
import discord from '../public/images/discord.svg';
import github from '../public/images/github.svg';
import heroicus1 from '../public/images/heroicus.png';
import Link from "next/link";
import Head from "next/head";
import {Righteous} from 'next/font/google';
import ReactParallaxTilt from "react-parallax-tilt";
const heroFont = Righteous({subsets: ["latin"], weight: "400"});


export function Index() {
  return <>
    <Head>
      <title>CloudX - Cloud Server Rental</title>
      <meta property="og:description" name="description"
            content="Cloud computing utilizing the Algorand Milkomeda blockchain and AWS. Rent Stable Diffusion or Docker servers."/>
      <meta name="twitter:card" content="summary"/>
      <meta name="twitter:site" content="@cloudx"/>
      <meta property="og:title" content="CloudX - Cloud Server Rental with NFTs"/>
      <meta property="og:image" content="/images/heroicus.png"/>
      <meta property="og:url" content="https://cloudx.xyz"/>
    </Head>
    <div className="bg-gradient-to-r from-[#984D38] to-[#181E41] overflow-x-hidden text-white">
      <div className="flex p-10 justify-end">
          <button className="px-4 py-2 font-bold bg-gradient-to-r from-[#B75CFF] to-[#671AE4] rounded-xl hover:bg-gradient-to-r hover:from-blue-200 hover:to-green-400">
            <Link href={'/portal'}>Connect Wallet</Link>
          </button>
      </div>
      <div className=" pt-12">
        <div className="py-10 flex items-center text-center justify-center">
          <div className={'tracking-wide ' + heroFont.className}>
            <div className={'text-8xl pb-10'}>Cloud<span className="text-[#B75CFF] hover:cursor-pointer hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-200 hover:to-green-400">X</span></div>
            <div className="text-5xl leading-tight">Cloud computing<br/> using NFT Rentals</div>
            <div className="my-10 text-2xl">Powered by the Algorand Network and AWS</div>
            <Link href="/portal"
                  className="text-2xl inline-block px-4 py-2 bg-gradient-to-r from-[#B75CFF] to-[#671AE4] rounded-xl hover:bg-gradient-to-r hover:from-blue-200 hover:to-green-400">
              Start Here
            </Link>
            <Link href="https://docs.cloudx.xyz"
                  className="ml-10 text-2xl inline-block px-4 py-2 bg-gradient-to-r from-[#B75CFF] to-[#671AE4] rounded-xl hover:bg-gradient-to-r hover:from-blue-200 hover:to-green-400">
              Docs
            </Link>

          </div>
          <div className="ml-24 hidden md:block overflow-hidden rounded-l-xl">
            <Image src={'/logo.png'} alt="Hero Image" width="500" height="350"
                   style={{'objectFit': 'cover', 'objectPosition': '0 0'} as any}/>
            <div className="">
              <img className="mt-10 inline-block" width="300" height="300" src="/milk_algo.png"/>
              <img className="mt-10 inline-block ml-20" src="https://d0.awsstatic.com/logos/powered-by-aws-white.png" width="200"
                   height="72"/>
            </div>

          </div>
        </div>
      </div>

      {/*<div className="my-10 pt-14 pb-10 text-center">*/}
      {/*  <div className="text-5xl">Anonymous server rentals</div>*/}
      {/*  <div className="mt-5 text-3xl">Pay with crypto on the Fantom network</div>*/}
      {/*  <div className="mt-10">*/}
      {/*    <img className="inline-block" width="100" height="100" src="/images/fantom.svg"/>*/}
      {/*    <img className="ml-20 inline-block" src="https://d0.awsstatic.com/logos/powered-by-aws-white.png" width="200" height="72"/>*/}

      {/*  </div>*/}
      {/*</div>*/}

      <div className="container mx-auto mt-20">

          <div className="flex gap-10 flex-col">
            <ReactParallaxTilt>
            <div className="cursor-pointer flex flex-col md:flex-row justify-center items-center bg-gradient-to-r from-[#eeaa98] to-purple-900 gap-10 rounded-lg mx-4 p-2 md:p-4">
              <div className="flex md:justify-start md:items-start">
                <img src="https://picsum.photos/id/68/367/297"  alt="diffusion" className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] "/>
              </div>
              <div className="">
            {/*<div className="text-lg">use case 1:</div>*/}
            <div className="text-3xl md:text-5xl font-bold text-white">Stable Diffusion</div>
            <div className="text-xl md:text-3xl mt-5">GPU Servers to generate AI Images</div>
            <div className="text-xl mt-5">Featuring Telsa T4 16GB GPUs</div>
            <div className="text-xl mt-5">Automatic1111 software preinstalled</div>
            <div className="flex justify-end">
              <Image src={'/stable.png'} alt="stability.ai" width={200} height={200} />
            </div>
            {/*<div className="text-xl mt-3">Text-to-Image, Image-to-Image, Inpainting, ControlNet, and more</div>*/}
            {/*<div className="text-xl mt-3">Popular models preinstalled</div>*/}
            {/*<Link href="/portal"*/}
            {/*      className="text-4xl inline-block border-amber-50 border-4 px-10 py-3 bg-neutral-900 mt-10 hover:border-amber-200">*/}
            {/*  Run*/}
            {/*</Link>*/}
              </div>
            </div>
            </ReactParallaxTilt>
            <ReactParallaxTilt>
            <div className="cursor-pointer flex flex-col md:flex-row justify-center items-center bg-gradient-to-r from-[#eeaa98] to-purple-900 gap-10 rounded-lg p-2 mx-4 md:p-4">
              <div className="flex justify-start items-start">
              <img src="https://picsum.photos/id/41/367/267"  alt="diffusion" className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] "/>
              </div>
              <div className="pt-10">
            {/*<div className="text-lg">use case 1:</div>*/}
            <div className="text-5xl font-bold text-white">Docker</div>
            <div className="text-3xl mt-5">Burstable GPU Servers using Docker</div>
            <div className="text-xl mt-5">Portainer for managing docker images/containers</div>
            <div className="flex justify-end">
              <Image src={'/images/docker.png'} alt="docker" width={250} height={250} />
            </div>
            {/*<div className="text-xl mt-3">Text-to-Image, Image-to-Image, Inpainting, ControlNet, and more</div>*/}
            {/*<div className="text-xl mt-3">Popular models preinstalled</div>*/}
            {/*<Link href="/portal"*/}
            {/*      className="text-4xl inline-block border-amber-50 border-4 px-10 py-3 bg-neutral-900 mt-10 hover:border-amber-200">*/}
            {/*  Run*/}
            {/*</Link>*/}
              </div>
            </div>
            </ReactParallaxTilt>
          </div>
     

        <div className="pt-32 pb-10 mx-auto text-center">
          <a href="https://discordapp.com/users/1116077220390244394" target="_blank" className="mx-10 inline-block">
            <Image src={'/discord.png'} height="100" width="60" alt="discord logo" className="inline-block mb-2 rounded-xl p-2"/>
          </a>
          <a href="https://github.com" target="_blank" className="mx-10 inline-block">
            <Image src={'/github.png'} height="50" width="50" alt="github logo" className="inline-block mb-2 rounded-xl"/>

          </a>
          <a href="https://twitter.com" target="_blank" className="mx-10 inline-block">
            <Image src={'/images/twitter.png'} height="50" width="50" alt="twitter logo" className="inline-block mb-2 rounded-xl"/>
          </a>
          <div>
          <div>
            <div className="mt-10">Brought to you by <a className="u" href="https://cloudX.com">Cloud X</a></div>
          </div>
        </div>
        <div className="text-center pb-10 text-sm">
          Powered by Heroicus, Milkomedia and AWS (AWS logo are trademarks of Amazon.com, Inc. or its affiliates).
        </div>
        </div>
      </div>
    </div>
  </>
}

export default Index
