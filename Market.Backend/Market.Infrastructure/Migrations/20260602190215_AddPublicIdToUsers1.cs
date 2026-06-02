using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Market.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicIdToUsers1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PublicId",
                table: "Users",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: false,
                defaultValue: "");

            // Popuni postojeće redove jedinstvenim GUID vrijednostima
            migrationBuilder.Sql(@"
                UPDATE Users
                SET PublicId = LOWER(REPLACE(CONVERT(nvarchar(36), NEWID()), '-', ''))
                WHERE PublicId = ''
            ");

            migrationBuilder.CreateIndex(
                name: "IX_Users_PublicId",
                table: "Users",
                column: "PublicId",
                unique: true);

            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Branch",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Branch",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_PublicId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PublicId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Branch");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Branch");
        }
    }
}