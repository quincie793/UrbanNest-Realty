BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Message] DROP CONSTRAINT [Message_propertyId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Message] ALTER COLUMN [propertyId] INT NULL;

-- CreateTable
CREATE TABLE [dbo].[MessageReply] (
    [id] INT NOT NULL IDENTITY(1,1),
    [messageId] INT NOT NULL,
    [content] NVARCHAR(1000) NOT NULL,
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [MessageReply_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [MessageReply_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Message] ADD CONSTRAINT [Message_propertyId_fkey] FOREIGN KEY ([propertyId]) REFERENCES [dbo].[Property]([id]) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[MessageReply] ADD CONSTRAINT [MessageReply_messageId_fkey] FOREIGN KEY ([messageId]) REFERENCES [dbo].[Message]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
