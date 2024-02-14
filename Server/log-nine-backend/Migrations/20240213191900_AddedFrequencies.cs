using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FunWithEF.Migrations
{
    /// <inheritdoc />
    public partial class AddedFrequencies : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "LrFrequency",
                table: "Teams",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.AddColumn<float>(
                name: "SrFrequency",
                table: "Teams",
                type: "REAL",
                nullable: false,
                defaultValue: 0f);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LrFrequency",
                table: "Teams");

            migrationBuilder.DropColumn(
                name: "SrFrequency",
                table: "Teams");
        }
    }
}
