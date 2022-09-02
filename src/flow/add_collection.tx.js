export const ADD_COLLECTION = (contractName, contractAddress) => `
import NonFungibleToken from 0x631e88ae7f1d7c20
import ZeedzINO from 0x7dc7430a06f38af3

// This transaction is what an account would run
// to set itself up to receive NFTs
transaction {

    prepare(signer: AuthAccount) {
        // // Return early if the account already has a collection
        // if signer.borrow<&ZeedzINO.Collection>(from: ZeedzINO.CollectionStoragePath) != nil {
        //     return
        // }

        // Create a new empty collection
        let collection <- ZeedzINO.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: ZeedzINO.CollectionStoragePath)

        // create a public capability for the collection
        signer.link<&{NonFungibleToken.CollectionPublic, ZeedzINO.ZeedzCollectionPublic}>(
            ZeedzINO.CollectionPublicPath,
            target: ZeedzINO.CollectionStoragePath
        )
    }
}
`