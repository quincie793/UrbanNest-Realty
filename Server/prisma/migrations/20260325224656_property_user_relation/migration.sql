/*
  Warnings:

  - You are about to drop the column `agentId` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the `Agent` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Property` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Favorite] DROP CONSTRAINT [Favorite_userId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Property] DROP CONSTRAINT [Property_agentId_fkey];

-- DropForeignKey
ALTER TABLE [dbo].[Review] DROP CONSTRAINT [Review_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Property] DROP COLUMN [agentId];
ALTER TABLE [dbo].[Property] ADD [userId] INT NOT NULL;

-- DropTable
DROP TABLE [dbo].[Agent];

-- AddForeignKey
ALTER TABLE [dbo].[Property] ADD CONSTRAINT [Property_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Favorite] ADD CONSTRAINT [Favorite_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Review] ADD CONSTRAINT [Review_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
