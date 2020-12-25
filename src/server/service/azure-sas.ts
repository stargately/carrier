import {
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} from "@azure/storage-blob";

export class AzureSasService {
  account: string;

  accountKey: string;

  sharedKeyCredential: StorageSharedKeyCredential;

  constructor({
    account,
    accountKey,
  }: {
    account: string;
    accountKey: string;
  }) {
    this.account = account;
    this.accountKey = accountKey;
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      this.account,
      this.accountKey
    );
  }

  // https://docs.microsoft.com/en-us/rest/api/storageservices/service-sas-examples
  getRwcUrl(container: string, filename: string): string {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 1);

    const sas = generateBlobSASQueryParameters(
      {
        expiresOn: tmr,
        permissions: BlobSASPermissions.parse("rwc"),
        containerName: container,
        startsOn: new Date(),
      },
      this.sharedKeyCredential
    );
    return `https://${
      this.account
    }.blob.core.windows.net/${container}/${filename}?${sas.toString()}`;
  }

  getLongTermReadUrl(container: string, filename: string): string {
    const tmr = new Date();
    tmr.setDate(tmr.getDate() + 2555);

    const sas = generateBlobSASQueryParameters(
      {
        expiresOn: tmr,
        permissions: BlobSASPermissions.parse("r"),
        containerName: container,
        startsOn: new Date(),
      },
      this.sharedKeyCredential
    );
    return `https://${
      this.account
    }.blob.core.windows.net/${container}/${filename}?${sas.toString()}`;
  }
}
