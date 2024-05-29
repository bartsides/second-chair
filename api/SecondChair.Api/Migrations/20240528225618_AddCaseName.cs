using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecondChair.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCaseName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Cases",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Cases");
        }
    }
}
