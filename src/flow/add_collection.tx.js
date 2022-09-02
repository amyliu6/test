export const ADD_COLLECTION = (contractName, contractAddress, collectionPublicPath) => `
import NonFungibleToken from 0x631e88ae7f1d7c20
import ${contractName} from ${contractAddress}

// This transaction is what an account would run
// to set itself up to receive NFTs
transaction {

    prepare(signer: AuthAccount) {
        // Return early if the account already has a collection
        if signer.borrow<&${contractName}.Collection>(from: ${contractName}.CollectionStoragePath) != nil {
            return
        }

        // Create a new empty collection
        let collection <- ${contractName}.createEmptyCollection()

        // save it to the account
        signer.save(<-collection, to: ${contractName}.CollectionStoragePath)

        // create a public capability for the collection
        // signer.link<&{NonFungibleToken.CollectionPublic, ${collectionPublicPath}}>(
        // signer.link<&{NonFungibleToken.CollectionPublic, ZeedzINO.ZeedzCollectionPublic}>(
        signer.link<&{NonFungibleToken.CollectionPublic}>(
            ${contractName}.CollectionPublicPath,
            target: ${contractName}.CollectionStoragePath
        )
    }
}
`