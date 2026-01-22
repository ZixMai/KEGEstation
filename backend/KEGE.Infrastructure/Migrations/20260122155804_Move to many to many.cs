using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KEGEstation.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Movetomanytomany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_kim_tasks_kims_KimId",
                table: "kim_tasks");

            migrationBuilder.DropIndex(
                name: "IX_kim_tasks_KimId",
                table: "kim_tasks");

            migrationBuilder.DropColumn(
                name: "KimId",
                table: "kim_tasks");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "KimId",
                table: "kim_tasks",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_kim_tasks_KimId",
                table: "kim_tasks",
                column: "KimId");

            migrationBuilder.AddForeignKey(
                name: "FK_kim_tasks_kims_KimId",
                table: "kim_tasks",
                column: "KimId",
                principalTable: "kims",
                principalColumn: "id");
        }
    }
}
