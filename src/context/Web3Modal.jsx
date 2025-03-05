'use client'
// import { cookieStorage, createStorage, http } from '@wagmi/core'
import { wagmiAdapter, projectId } from '@/wagmiConfig'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { mainnet, sepolia, arbitrum, avalanche, base, optimism, polygon } from '@reown/appkit/networks'
import React from 'react'
import { cookieToInitialState, WagmiProvider } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
// import { cookies } from 'next/headers'
// Set up queryClient
const queryClient = new QueryClient()


if (!projectId) {
    throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
    name: "appkit-example-scroll",
    description: "AppKit Example - Scroll",
    url: "https://scrollapp.com", // origin must match your domain & subdomain
    icons: ["https://avatars.githubusercontent.com/u/179229932"]
}

// Create the modal
const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: [mainnet, sepolia],
    defaultNetwork: mainnet,
    metadata: metadata,
    allowUnsupportedChains: false,
    features: {
        email: false,
        socials: false,
        swaps: false,
        history: false,
        onramp: false,
        emailShowWallets: false,
        analytics: false, // Optional - defaults to your Cloud configuration
    }
})

function ContextProvider({ children }) {
    // const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig)
    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}

export default ContextProvider
