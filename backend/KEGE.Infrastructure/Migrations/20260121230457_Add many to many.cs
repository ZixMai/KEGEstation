using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KEGEstation.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Addmanytomany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_kim_tasks_kims_kim_id",
                table: "kim_tasks");

            migrationBuilder.RenameColumn(
                name: "kim_id",
                table: "kim_tasks",
                newName: "KimId");

            migrationBuilder.RenameIndex(
                name: "ix_kim_tasks_kim_id",
                table: "kim_tasks",
                newName: "IX_kim_tasks_KimId");

            migrationBuilder.AlterColumn<long>(
                name: "KimId",
                table: "kim_tasks",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<long>(
                name: "creator_id",
                table: "kim_tasks",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "kim_to_tasks",
                columns: table => new
                {
                    kim_id = table.Column<long>(type: "bigint", nullable: false),
                    kim_task_id = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_kim_to_tasks", x => new { x.kim_id, x.kim_task_id });
                    table.ForeignKey(
                        name: "FK_kim_to_tasks_kim_tasks_kim_task_id",
                        column: x => x.kim_task_id,
                        principalTable: "kim_tasks",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_kim_to_tasks_kims_kim_id",
                        column: x => x.kim_id,
                        principalTable: "kims",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_kim_tasks_creator_id",
                table: "kim_tasks",
                column: "creator_id");

            migrationBuilder.CreateIndex(
                name: "IX_kim_to_tasks_kim_task_id",
                table: "kim_to_tasks",
                column: "kim_task_id");

            migrationBuilder.AddForeignKey(
                name: "FK_kim_tasks_kims_KimId",
                table: "kim_tasks",
                column: "KimId",
                principalTable: "kims",
                principalColumn: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_kim_tasks_users_creator_id",
                table: "kim_tasks",
                column: "creator_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_kim_tasks_kims_KimId",
                table: "kim_tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_kim_tasks_users_creator_id",
                table: "kim_tasks");

            migrationBuilder.DropTable(
                name: "kim_to_tasks");

            migrationBuilder.DropIndex(
                name: "ix_kim_tasks_creator_id",
                table: "kim_tasks");

            migrationBuilder.DropColumn(
                name: "creator_id",
                table: "kim_tasks");

            migrationBuilder.RenameColumn(
                name: "KimId",
                table: "kim_tasks",
                newName: "kim_id");

            migrationBuilder.RenameIndex(
                name: "IX_kim_tasks_KimId",
                table: "kim_tasks",
                newName: "ix_kim_tasks_kim_id");

            migrationBuilder.AlterColumn<long>(
                name: "kim_id",
                table: "kim_tasks",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_kim_tasks_kims_kim_id",
                table: "kim_tasks",
                column: "kim_id",
                principalTable: "kims",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
