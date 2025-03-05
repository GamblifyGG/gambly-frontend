import { createContext } from 'react';
import React, { useState, useEffect } from 'react';
import { useAccount, useSignMessage, useDisconnect, useBalance } from "wagmi";
import axios from 'axios'
// import { useWeb3Modal } from '@web3modal/wagmi/react'
import useStateRef from 'react-usestateref';
import { Router, useRouter } from 'next/router';


export const MainContext = createContext();

const MainProvider = ({ children }) => {
    const router = useRouter();
    const [userAuth, setUserAuth] = useStateRef(null)

    const [userSettings, setUserSettings, userSettingsRef] = useStateRef({
        walletAddress: null,
        loggedIn: false,
        loginWindowOpen: false,
        referrals: {
            referralBets: [],
            totalAmount: 0,
            totalReferredUsers: 0
        },
        balance: 0,
        tokenSymbol: 'ETH',
        casino: null,
        tokenBalances: [],
    });

    const [tokenSettings, setTokenSettings, tokenSettingsRef] = useStateRef({
        tokenAddress: null,
        tokenSymbol: null,
        tokenName: null,
        tokenDecimals: null,
        tokenBalances: [],
    });

    // const { chain, chains } = useNetwork()

    const { isConnected, address, status } = useAccount();
    const { disconnect } = useDisconnect();
    const balance = useBalance({
        address: address
    })


    const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
        message: 'gm wagmi frens',
    })
    // const { open } = useWeb3Modal()

    const disconnectNow = () => {
        // open({ view: 'Disconnect' })
        disconnect()
        removeLocalStorage()
        // console.log('Disconnected bitches')
    }

    useEffect(() => {
        // if (address === undefined) {
        //     // console.log("disconnecting")
        //     disconnectNow();
        //     return;
        // }
        // let addressFromLocalStorage = localStorage.getItem('walletAddress');
        // if (addressFromLocalStorage !== address) {
        //     localStorage.removeItem('token')
        //     localStorage.removeItem('refreshToken')
        //     localStorage.removeItem('walletAddress')
        // }
        // if (addressFromLocalStorage === address) {
        //     console.log("Update user settings")
        //     // updateUserSettings();
        // }
    }, [address])

    const removeLocalStorage = () => {
        // console.log("removing local storage")
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('walletAddress')
        // localStorage.removeItem('wagmi.connectedRdns');
        setUserSettings({
            ...userSettingsRef.current,
            walletAddress: null,
            loggedIn: false,
        });
    }

    const updateUserSettings = (
        balances = [],
        referrals = {
            referralBets: [],
            totalAmount: 0,
            totalReferredUsers: 0
        }) => {
        console.log("updating user settings and balances", balances, address)
        setTimeout(() => {
            setUserSettings({
                ...userSettingsRef.current,
                balances,
                walletAddress: address,
                loggedIn: true,
                referrals: referrals,
                balance: balance.data.formatted,
                balanceSymbol: balance.data.symbol,
                loginWindowOpen: false
            });
        }, 50)
    }

    // useEffect(() => {
    //     if (chain?.id) {
    //         setUserSettings({
    //             ...userSettingsRef.current,
    //             chain: chain.id
    //         })
    //     }
    // }, [chain])


    useEffect(() => {
        // if(isSuccess === true) {
        //     console.log("User signed message", data, address)
        // }
        // if (isSuccess === true && isLoading === false && isError === false) {
        //     // console.log("User signed message", data, address)
        //     axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/verifySignature', {
        //         walletAddress: address,
        //         refCode: localStorage.getItem('referralCode') || null,
        //         signature: data
        //     }).then((res) => {
        //         // console.log(res.data);
        //         let balances = [];
        //         if (res.data.balances) {
        //             // console.log("balances", res.data.balances)
        //             balances = res.data.balances
        //         }
        //         let referrals = {
        //             referralBets: [],
        //             totalAmount: 0,
        //             totalReferredUsers: 0
        //         };
        //         if (res.data.referrals) {
        //             // console.log("Setting referrals", res.data.referrals)
        //             referrals = res.data.referrals
        //         }
        //         if (res.data.tokens) {
        //             // console.log("Signing in: ", res.data.tokens)
        //             localStorage.setItem('token', res.data.tokens.accessToken)
        //             localStorage.setItem('refreshToken', res.data.tokens.refreshToken)
        //             localStorage.setItem('walletAddress', address)
        //             updateUserSettings(balances, referrals);
        //         }
        //     }).catch((err) => {
        //         // console.log("err", err)
        //         disconnectNow();
        //     })
        // }
        
        // if (isError === true) {
        //     disconnectNow();
        // }

    }, [isSuccess, isError, isLoading, data])

    useEffect(() => {
        // if (isConnected) {
            

        //     // console.log('Connected to', address, status)
        //     if (status === 'connected') {

        //         setUserSettings({
        //             ...userSettingsRef.current,
        //             walletAddress: address,
        //             loginWindowOpen: true,
        //         });


        //         if (localStorage.getItem('token') && localStorage.getItem('refreshToken') && localStorage.getItem('walletAddress')) {
        //             // console.log("local storage exists")
        //             if (localStorage.getItem('walletAddress') !== address) {
        //                 // console.log("wallet address does not match")
        //                 // console.log("wallet address does not match")
        //                 localStorage.removeItem('token')
        //                 localStorage.removeItem('refreshToken')
        //                 localStorage.removeItem('walletAddress')
        //                 console.log("Disconnecting")
        //                 try {
        //                     console.log("Trying to sign message")
        //                     setTimeout(() => {
        //                         let signedMessage = signMessage()
        //                         console.log("signed message", signedMessage)
        //                     }, 1000)
        //                 } catch (error) {
        //                     disconnectNow();
        //                     console.log(error)
        //                 }
        //                 return;
        //             }

        //             let token = localStorage.getItem('token')
        //             let refreshToken = localStorage.getItem('refreshToken')
        //             // console.log("token", token)
        //             // console.log(process.env.NEXT_PUBLIC_BACKEND_URL)
        //             axios.post(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/verifyToken', {
        //                 token: token,
        //                 refreshToken: refreshToken
        //             }).then((res) => {
        //                 let balances = [];
        //                 let referrals = {
        //                     referralBets: [],
        //                     totalAmount: 0,
        //                     totalReferredUsers: 0
        //                 };

        //                 if (res.data.referrals) {
        //                     // console.log("Setting referrals", res.data.referrals)
        //                     referrals = res.data.referrals
        //                 }
        //                 if (res.data.balances) {
        //                     // console.log("Setting balances", res.data.balances)
        //                     balances = res.data.balances
        //                 }
        //                 if (res.error) {
        //                     console.log("error", res.error)
        //                     disconnectNow();
        //                 } else {
        //                     console.log("Updating balances")
        //                     updateUserSettings(balances, referrals);
        //                 }
        //             }).catch((err) => {
        //                 console.log("err", err)
        //                 disconnectNow();
        //             })
        //         } else {
        //             try {
        //                 let signedMessage = signMessage()
        //             } catch (error) {

        //             }
        //         }
        //     }
        // }
    }, [address, status])


    useEffect(() => {
        // if we have ?ref
        // console.log(router.query)
        if (router.query.ref) {
            localStorage.setItem('referralCode', router.query.ref)
        }
    }, [router.query])



    return (
        <MainContext.Provider value={{ userSettings, setUserSettings, userSettingsRef, tokenSettings, setTokenSettings }}>
            {children}
        </MainContext.Provider>
    );
};

export default MainProvider;