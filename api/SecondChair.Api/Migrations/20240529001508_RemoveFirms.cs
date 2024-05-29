using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SecondChair.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveFirms : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cases_Firms_FirmId",
                table: "Cases");

            migrationBuilder.DropTable(
                name: "Firms");

            migrationBuilder.DropIndex(
                name: "IX_Cases_FirmId",
                table: "Cases");

            migrationBuilder.DropColumn(
                name: "FirmId",
                table: "Cases");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "FirmId",
                table: "Cases",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "Firms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Firms", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cases_FirmId",
                table: "Cases",
                column: "FirmId");

            migrationBuilder.AddForeignKey(
                name: "FK_Cases_Firms_FirmId",
                table: "Cases",
                column: "FirmId",
                principalTable: "Firms",
                principalColumn: "Id");
        }
    }
}
