BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Property] DROP CONSTRAINT [Property_agentId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Property] ALTER COLUMN [agentId] INT NULL;

-- AddForeignKey
ALTER TABLE [dbo].[Property] ADD CONSTRAINT [Property_agentId_fkey] FOREIGN KEY ([agentId]) REFERENCES [dbo].[Agent]([id]) ON DELETE SET NULL ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
