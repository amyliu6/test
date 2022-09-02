export const GET_NFT_COLLECTION = (contractName, contractAddress) => `
import ${contractName} from ${contractAddress}
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(accountAddress: Address): [&NonFungibleToken.NFT] {
  let account = getAccount(accountAddress).getCapability(ZeedzINO.CollectionPublicPath)
                    .borrow<&{NonFungibleToken.CollectionPublic}>()
                    ?? panic("A NFT collection doesn't exist here.")

  let ids = account.getIDs();
  let nftRefs: [&NonFungibleToken.NFT] = []
  for id in ids  {
    let nftRef: &NonFungibleToken.NFT  = account.borrowNFT(id: id)
    nftRefs.append(nftRef)
  }
  return nftRefs
}
`;
