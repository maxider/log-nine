using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LogNineBackend.Migrations
{
    /// <inheritdoc />
    public partial class BoardIdList : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TaskIds",
                table: "Boards",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TeamIds",
                table: "Boards",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TaskIds",
                table: "Boards");

            migrationBuilder.DropColumn(
                name: "TeamIds",
                table: "Boards");
        }
    }
}
