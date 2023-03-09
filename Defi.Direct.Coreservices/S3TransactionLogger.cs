using Amazon.S3;
using Defi.Direct.Coreservices.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Defi.Direct.Domain.Models;
using Microsoft.Extensions.Logging;
using Amazon;
using Microsoft.Extensions.Options;
using Defi.Direct.Coreservices.Configuration;
using System.Threading.Tasks;

namespace Defi.Direct.Coreservices
{
    public class S3TransactionLogger : ITransactionLogger
    {
        private IAmazonS3 _amazonS3;
        ILogger<S3TransactionLogger> logWriter;
        S3Configuration s3Configuration;
        public S3TransactionLogger(IAmazonS3 amazonS3, ILogger<S3TransactionLogger> logWriter, IOptions<S3Configuration> s3Configuration)
        {
            this._amazonS3 = amazonS3;
            this.logWriter = logWriter;
            this.s3Configuration = s3Configuration.Value ?? null;
        }
        public async void Create(DataLog transaction)
        {
            try
            {
                await Create(transaction, transaction.Id, "TransactionLog");
            }
            catch (Exception e)
            {
                logWriter.LogError(e, e.Message);
            }
            
        }

        public async void Create(Apps transaction)
        {
            try
            {
                var scrubbedTransaction = new { transaction.Id, transaction.SiteId, transaction.EmailId, transaction.ClientId, transaction.ClientName, transaction.VersionId, transaction.CreateDate, transaction.UpdateDate, transaction.AppSubmitDate, transaction.AppId, transaction.ApplicationNumber, transaction.FirstName, transaction.LastName, transaction.HostName, transaction.VersionTitle };
                await Create(scrubbedTransaction, Guid.NewGuid(), "Application");
            }
            catch (Exception e)
            {
                logWriter.LogError(e, e.Message);
            }
        }

        private async Task Create<T>(T transaction, Guid Id, string folder)
        {
            try
            {
                var request = new Amazon.S3.Model.PutObjectRequest() { BucketName = s3Configuration.Bucket, Key = $"{s3Configuration.Key}/{folder}/{Id}.json", ContentBody = JsonConvert.SerializeObject(transaction), ContentType = "text/plain" };
                var response = await _amazonS3.PutObjectAsync(request);
            }
            catch (Exception e)
            {
                logWriter.LogError(e, e.Message);
            }
            
        }
    }
}
